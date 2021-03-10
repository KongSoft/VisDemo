import random
f = "data2.csv"
a = 50
with open(f,"w") as file:
    file.write(str("x1") + "," + str("x2") + "\n")
    for i in range(a):
        file.write(str(round(random.uniform(2, 8), 2)) + ","+str(round(random.uniform(4, 10), 2))+"\n")
    for i in range(a):
        file.write(str(round(random.uniform(6, 12), 2)) + ","+str(round(random.uniform(8, 14), 2)) +"\n")
    file.write("1,1\n")
    file.write("2,13\n")
    file.write("12,3\n")