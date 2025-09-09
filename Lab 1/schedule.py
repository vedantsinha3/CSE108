def read_course_data(filename):
    with open(filename, "r") as file:
        lines = file.readlines()
    
    lines = [line.strip() for line in lines]
    return lines

def parse_all_courses(lines):
    num_courses = int(lines[0])
    courses = []
    
    for i in range(num_courses):
        start_line = 1 + (i * 8)
        course_info = {
            'department': lines[start_line],
            'number': lines[start_line + 1],
            'name': lines[start_line + 2],
            'credits': int(lines[start_line + 3]),
            'lecture_days': lines[start_line + 4],
            'start_time': lines[start_line + 5],
            'end_time': lines[start_line + 6],
            'avg_grade': float(lines[start_line + 7])
        }
        courses.append(course_info)
    
    return courses

def format_course_output(course, course_num):
    full_name = f"{course['department']}{course['number']}: {course['name']}"
    
    output = f"COURSE {course_num}: {full_name}\n"
    output += f"Number of Credits: {course['credits']}\n"
    output += f"Days of Lectures: {course['lecture_days']}\n"
    output += f"Lecture Time: {course['start_time']} - {course['end_time']}\n"
    output += f"Stat: on average, students get {int(course['avg_grade'])}% in this course\n"
    
    return output

def write_output_file(courses, filename="schedule_output.txt"):
    with open(filename, "w") as file:
        for i, course in enumerate(courses, 1):
            file.write(format_course_output(course, i))
            if i < len(courses):
                file.write("\n")

def print_all_courses(courses):
    for i, course in enumerate(courses, 1):
        print(format_course_output(course, i))
        if i < len(courses):
            print()

def main():
    lines = read_course_data("classesInput.txt")
    courses = parse_all_courses(lines)
    print_all_courses(courses)
    write_output_file(courses)

if __name__ == "__main__":
    main()
