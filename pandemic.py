"""Pandemic Simulation"""

import random
import matplotlib.pyplot as plt
import numpy as np

# Create a probability function
def chance(probability):
    roll = random.randint(1, 1000)
    if roll <= (probability*1000) :
        return True
    else:
        return False

"""count = 0                 #TEST OF CHANCE FUNCTION
for i in range(100):
    if chance(0.5) == True:
        count += 1
    else:
        continue"""


# Define variables

uninfected_size = 1000
initial_infections = 2
infection_constant = 1
prob_of_recovery = 0.9

closing_time = 10

# Create the lists

uninfected = [i for i in range(uninfected_size)]
infected = [[1, 0] for i in range(initial_infections)]
recovered = []
died = []

final_plot = []

while len(infected) > 0:
    # First thing in the loop is to 'assess' the situation, i.e. count the numbers in each list,
    # and add it as a nested list in final_plot, so we can plot the graph of the simulation.
    entry = []
    uninfected_today = len(uninfected)
    infected_today = len(infected)
    recovered_today = len(recovered)
    died_today = len(died)

    entry.append(uninfected_today)
    entry.append(infected_today)
    entry.append(recovered_today)
    entry.append(died_today)
    final_plot.append(entry)

    #print("final_plot:")
    #print(final_plot)
    #print()

    # Now iterate through uninfected list, and for each item use the chance function to assses if the item
    # should be moved to the infected list

    prob_infection = infection_constant * (infected_today/(uninfected_today+infected_today))
    uninfected_new = []
    for i in range(uninfected_today):
        if chance(prob_infection) == True:
            infected.append([uninfected[i], 0])
        else:
            uninfected_new.append(uninfected[i])
    uninfected = uninfected_new


    # Now iterate through infected list to check if enough time has passed for the entry to either be moved to the
    # recovered or died lists, namely the value of index 1 from each nested list. If not, add 1 to that entry to keep the count clocking up.

    infected_new = []
    for i in range(len(infected)):
        if infected[i][1] > closing_time:
            if chance(prob_of_recovery) == True:
                recovered.append(infected[i][0])
            else:
                died.append(infected[i][0])
        else:
            infected[i][1] += 1
            infected_new.append(infected[i])
    infected = infected_new


# Plot the final_entry to analyse simulation

print()
print("Final Plot Value List: ")
print()
print(final_plot)
print()

uninfected_plot = [i[0] for i in final_plot]
infected_plot = [i[1] for i in final_plot]
recovered_plot = [i[2] for i in final_plot]
died_plot = [i[3] for i in final_plot]


plt.plot(uninfected_plot)
plt.ylabel("Uninfected")
plt.show()

plt.plot(infected_plot)
plt.ylabel("Infected")
plt.show()

plt.plot(recovered_plot)
plt.ylabel("Recovered")
plt.show()

plt.plot(died_plot)
plt.ylabel("Died")
plt.show()

plt.plot(uninfected_plot, 'y')
plt.plot(infected_plot, 'r' )
plt.plot(recovered_plot, 'g')
plt.plot(died_plot, 'b')
plt.show()



# Next, we can possibly add the limited capacity of the healthcare system, so we see the effects of 'flattening the curve
# on the number of deaths.




