import json
import os

def load_grades(filename):
    try:
        with open(filename, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

def save_grades(filename, grades_dict):
    with open(filename, 'w') as file:
        json.dump(grades_dict, file, indent=3)

def create_student(grades_dict):
    name = input("Enter student's full name: ")
    try:
        grade = float(input("Enter student's grade: "))
        grades_dict[name] = grade
        print(f"Added {name} with grade {grade}")
    except ValueError:
        print("Invalid grade.")

def get_grade(grades_dict):
    name = input("Enter student's full name: ")
    if name in grades_dict:
        print(f"{name}'s grade is: {grades_dict[name]}")
    else:
        print(f"{name} not found.")

def edit_grade(grades_dict):
    name = input("Enter student's full name: ")
    if name in grades_dict:
        try:
            new_grade = float(input(f"Enter new grade for {name} (current: {grades_dict[name]}): "))
            old_grade = grades_dict[name]
            grades_dict[name] = new_grade
            print(f"Updated {name}'s grade from {old_grade} to {new_grade}")
        except ValueError:
            print("Invalid grade.")
    else:
        print(f"Student '{name}' not found.")

def delete_grade(grades_dict):
    name = input("Enter student's full name: ")
    if name in grades_dict:
        grade = grades_dict.pop(name)
        print(f"Deleted {name} (grade: {grade})")
    else:
        print(f"{name} not found.")

def display_all_grades(grades_dict):
    if not grades_dict:
        print("No grades recorded.")
    else:
        print("\nAll grades:")
        for name, grade in grades_dict.items():
            print(f"  {name}: {grade}")

def main():
    filename = "grades.txt"
    
    grades = load_grades(filename)
    print(f"Loaded {len(grades)} student records.")
    
    while True:
        print("\n=== Grade Management System ===")
        print("1. Add new student")
        print("2. Get student grade")
        print("3. Edit student grade")
        print("4. Delete student")
        print("5. Display all grades")
        print("6. Exit")
        
        choice = input("Choose an option (1-6): ")
        
        if choice == '1':
            create_student(grades)
        elif choice == '2':
            get_grade(grades)
        elif choice == '3':
            edit_grade(grades)
        elif choice == '4':
            delete_grade(grades)
        elif choice == '5':
            display_all_grades(grades)
        elif choice == '6':
            save_grades(filename, grades)
            print("Grades saved.")
            break
        else:
            print("Invalid option. Please choose 1-6.")
        save_grades(filename, grades)

if __name__ == "__main__":
    main()
    