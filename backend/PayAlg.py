import random
import collections


class PayAlg:
    """
    A class to determine who should pay for a shared bill based on a weighted random selection.
    The algorithm tracks how much each person has contributed relative to their share of the costs.
    People who have paid less than their share are more likely to be selected to pay next.
    """

    def __init__(self, people: list = []):
        """
        Initializes the PayAlg object.

        Args:
            people (list): Names of the people participating.
        """
        # A dictionary to store the running balance for each person.
        # A positive balance means the person has paid less than their share.
        # A negative balance means the person has paid more than their share.
        self.people = collections.defaultdict(int)
        for p in people:
            self.people[p.capitalize()] = 0

    def update_orders(self, orders: list[tuple]):
        """
        Updates each person's balance with the cost of their new orders.

        Args:
            orders (list[tuple]): A list of tuples, where each tuple contains a person's name and the cost of their order.
                                  Example: [("Olivia", 25), ("Liam", 30)]
        """
        for o in orders:
            person, order = o
            # Add the cost of the order to the person's balance.
            self.people[person.capitalize()] += order

    def pick_person(self):
        """
        Selects a person to pay based on their current balance.

        The selection is weighted. A person's weight is equal to their balance, meaning
        the more a person owes to the group (a higher positive balance), the more likely
        they are to be chosen. If a person has a negative balance (they've overpaid),
        their weight is set to 0, so they will not be chosen to pay.

        Returns:
            str: The name of the person selected to pay.
        """
        # Get the list of people.
        people = list(self.people.keys())
        # Create a list of weights. The weight is the person's balance, but not less than 0.
        weights = [num if num >= 0 else 0 for num in list(self.people.values())]
        # Randomly choose one person from the population based on the calculated weights.
        return random.choices(population=people, weights=weights, k=1)[0]

    def who_pays(self, orders: list[tuple]):
        """
        Determines who pays for the current round of orders.

        This method first updates everyone's balance with the new orders, then
        selects a payer, and finally updates the payer's balance by subtracting the
        total cost of all orders in this round.

        Args:
            orders (list[tuple]): A list of tuples representing the orders.

        Returns:
            str: The name of the person who will pay.
        """
        # Update everyone's balance with their individual order costs.
        self.update_orders(orders)
        # Select the person who will pay for this round.
        person = self.pick_person()
        # The payer's balance is reduced by the total cost of everyone's orders for this round.
        self.people[person.capitalize()] -= sum([o[1] for o in orders])
        return person


# This block of code demonstrates the functionality of the PayAlg class when the script is run directly.
if __name__ == "__main__":
    # A list of names participating.
    names = ["Olivia", "Liam", "Emma", "Noah", "Amelia", "Oliver", "Sophia"]

    # Initialize the PayAlg class. It can be initialized with a list of names or empty.
    # If initialized empty, names will be added dynamically as orders are processed.
    # alg = PayAlg(names)
    alg = PayAlg()

    # Create a list of orders. In this simple case, everyone's order costs 1 unit.
    orders = []
    for n in names:
        if (n == "Sophia"): # Used to change cost of specific person's order for testing
            orders.append((n, 1))
            continue
        orders.append((n, 1))

    # A dictionary to count how many times each person is chosen to pay.
    who_pays = collections.defaultdict(int)
    # A list to record the sequence of who paid.
    pay_order = []

    # Run a simulation for 700 rounds of payments.
    for i in range(700):
        # Determine who pays for the current set of orders.
        person = alg.who_pays(orders)
        # Increment the payment count for the selected person.
        who_pays[person] += 1
        # Record the person who paid in this round.
        pay_order.append(person)
        # Print the current balances of all people after each round.
        print(alg.people)

    # After the simulation, print the final results.
    # Print the total number of times each person paid.
    print(who_pays)
    # Print the entire sequence of payers.
    print(pay_order)