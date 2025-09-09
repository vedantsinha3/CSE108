nums = input("Enter a list of numbers separated by spaces: ")
nums = nums.split()

if len(nums) < 2: 
    print("Error: Please enter at least 2 numbers")
    exit()

sum = 0 
for i in range(len(nums)):
    try: 
        value = float(nums[i])
    except ValueError:
        print("Error: Please enter a valid number")
        exit()
    sum +=nums[i]


print("The sum of the numbers is: ", sum)

