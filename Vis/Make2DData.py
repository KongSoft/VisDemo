import random
f = "data2.csv"
a = 100
with open(f,"w") as file:
    file.write(str("x1") + "," + str("x2") + "," + str("x3") + "\n")
    for i in range(a):
        file.write(str(round(random.uniform(1, 4), 2)) + ","+str(round(random.uniform(2, 5), 2)) + ","+str(round(random.uniform(1, 4), 2))+"\n")
    for i in range(a):
        file.write(str(round(random.uniform(3, 7), 2)) + ","+str(round(random.uniform(4, 7), 2)) + ","+str(round(random.uniform(3, 7), 2))+"\n")
    # for i in range(20):
    #     for j  in range(10):
    #         file.write(str(i) + "," + str(j) + "\n")