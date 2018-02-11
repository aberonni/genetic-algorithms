import Organism from './Organism';

class Population {
	public generations: number;
	public complete: boolean;
	public averageFitness: number;
	public best: Organism;

	private population: Organism[];
	private mutationRate: number;
	private idealFitness: number;
	private size: number;

	constructor(population, mutationRate, idealFitness) {
		this.population = population;
		this.mutationRate = mutationRate;
		this.idealFitness = idealFitness;

		this.size = population.length;

		this.generations = 1;
		this.complete = false;

		this.averageFitness = 0;
	}

	public updateFitness() {
		let totalFitness = 0;
		let bestOrganism;

		this.population.forEach((organism) => {
			organism.updateFitness();

			totalFitness += organism.fitness;

			if (!bestOrganism || organism.fitness > bestOrganism.fitness) {
				bestOrganism = organism;
			}

			console.log(organism.toString());
		});

		this.best = bestOrganism;

		if (this.idealFitness && this.best.fitness === this.idealFitness) {
			this.complete = true;
		}

		this.averageFitness = totalFitness / this.size;
	}

	public reproduce() {
		const maxFitness = this.best.fitness;

		let totalWeight = 0;

		this.population.forEach((organism) => {
			const weight = Math.round(organism.fitness / maxFitness * 100);
			organism.weight = weight;
			totalWeight += weight;
		});

		const newPopulation = [];

		for (let i = 0; i < this.size; i++) {
			// pick two parents
			const partnerA = this.population.find(this.weightedRandom(totalWeight));
			const partnerB = this.population.find(this.weightedRandom(totalWeight));
			// crossover
			const child = partnerA.crossover(partnerB);
			// mutation
			child.mutate(this.mutationRate);
			// add child to population
			newPopulation[i] = child;
		}

		this.population = newPopulation;

		this.generations++;
	}

	private weightedRandom(totalWeight, weightProp = 'weight') {
		let random = Math.floor(Math.random() * (totalWeight + 1));

		return (organism) => {
			random -= organism[weightProp];
			return random <= 0;
		};
	}
}

export default Population;
