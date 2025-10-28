from __future__ import annotations

import os
from flask import Flask, jsonify, request, send_from_directory, abort
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func


APP_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(APP_DIR, 'static')
DB_PATH = os.path.join(APP_DIR, 'grades.db')


db = SQLAlchemy()


class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False, index=True)
    grade = db.Column(db.Float, nullable=False)

    def to_mapping(self) -> dict[str, float]:
        return {self.name: float(self.grade)}


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    app.wsgi_app = ProxyFix(app.wsgi_app)  # type: ignore
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    os.makedirs(APP_DIR, exist_ok=True)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    # ---------- API ROUTES ----------
    @app.get('/grades')
    def get_all_grades():
        rows = Student.query.order_by(func.lower(Student.name)).all()
        return jsonify({s.name: float(s.grade) for s in rows})

    @app.get('/grades/<string:name>')
    def get_grade(name: str):
        student = Student.query.filter_by(name=name).first()
        if student is None:
            abort(404, description=f"Student '{name}' not found")
        return jsonify(student.to_mapping())

    @app.post('/grades')
    def create_grade():
        try:
            payload = request.get_json(force=True)
        except Exception:
            abort(400, description='Invalid JSON')

        name = (payload or {}).get('name')
        grade = (payload or {}).get('grade')

        if not isinstance(name, str) or name.strip() == '':
            abort(400, description='Name is required')
        try:
            grade_value = float(grade)
        except (TypeError, ValueError):
            abort(400, description='Grade must be a number')

        if Student.query.filter_by(name=name).first() is not None:
            abort(409, description='Student already exists')

        student = Student(name=name, grade=grade_value)
        db.session.add(student)
        db.session.commit()
        return jsonify(student.to_mapping()), 201

    @app.put('/grades/<string:name>')
    def update_grade(name: str):
        student = Student.query.filter_by(name=name).first()
        if student is None:
            abort(404, description=f"Student '{name}' not found")
        try:
            payload = request.get_json(force=True)
        except Exception:
            abort(400, description='Invalid JSON')

        grade = (payload or {}).get('grade')
        try:
            grade_value = float(grade)
        except (TypeError, ValueError):
            abort(400, description='Grade must be a number')

        student.grade = grade_value
        db.session.commit()
        return jsonify(student.to_mapping())

    @app.delete('/grades/<string:name>')
    def delete_grade(name: str):
        student = Student.query.filter_by(name=name).first()
        if student is None:
            abort(404, description=f"Student '{name}' not found")
        removed = student.to_mapping()
        db.session.delete(student)
        db.session.commit()
        return jsonify(removed)

    # ---------- STATIC FILES ----------
    @app.get('/')
    def index():
        return send_from_directory(STATIC_DIR, 'index.html')

    @app.get('/<path:path>')
    def static_files(path: str):
        return send_from_directory(STATIC_DIR, path)

    @app.get('/health')
    def health():
        return jsonify({'status': 'ok'})

    @app.errorhandler(400)
    @app.errorhandler(404)
    @app.errorhandler(409)
    def handle_error(err):  # type: ignore
        if request.path.startswith('/grades') or request.path.startswith('/health'):
            code = getattr(err, 'code', 500)
            return jsonify({'error': getattr(err, 'description', str(err))}), code
        return index()

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=True)


