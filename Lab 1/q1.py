nums_str = input("Enter a list of numbers separated by spaces: ")
nums = nums_str.split()


if len(nums) < 2: 
    print("Error: Please enter at least 2 numbers")
    exit()


total = 0 
for num_str in nums:
    try: 
        value = float(num_str)
        total += value
    except ValueError:
        print(f"Error: '{num_str}' is not a valid number.")
        exit()

print(f"The sum of the numbers is: {total}")