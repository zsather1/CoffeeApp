import random
import collections


class PayAlg:

    def __init__(self, people: list = []):
        self.people = collections.defaultdict(int)
        for p in people:
            self.people[p] = 0

    def update_orders(self, orders: list[tuple]):
        for o in orders:
            person, order = o
            self.people[person] += order

    def pick_person(self):
        people = list(self.people.keys())
        weights = [num if num >= 0 else 0 for num in list(self.people.values())]
        return random.choices(population=people, weights=weights, k=1)[0]

    def who_pays(self, orders: list[tuple]):
        self.update_orders(orders)
        person = self.pick_person()
        self.people[person] -= sum([o[1] for o in orders])
        return person


if __name__ == "__main__":
    names = ["Olivia", "Liam", "Emma", "Noah", "Amelia", "Oliver", "Sophia"]
    #alg = PayAlg(names)
    alg = PayAlg()
    orders = []
    for n in names:
        if (n == "Sophia"):
            orders.append((n, 1))
            continue
        orders.append((n, 1))
    who_pays = collections.defaultdict(int)
    pay_order = []
    for i in range(700):
        person = alg.who_pays(orders)
        who_pays[person] += 1
        pay_order.append(person)
        print(alg.people)
    print(who_pays)
    print(pay_order)
