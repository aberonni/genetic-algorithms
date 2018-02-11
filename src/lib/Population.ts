import * as _ from 'lodash';

import Organism from './Organism';

export default class Population {
	public generations: number;
	public complete: boolean;
	public averageFitness: number;
	public best: Organism;

	private population: Organism[];
	private mutationRate: number;
	private idealFitness: number;
	private size: number;

	constructor(
		population: Organism[],
		mutationRate: number,
		idealFitness: number
	) {
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
		let bestOrganism: Organism;

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
		const newPopulation = [];

		for (let i = 0; i < this.size; i++) {
			// pick two parents
			const partnerA = this.rejectionSample();
			const partnerB = this.rejectionSample();
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

	// https://en.wikipedia.org/wiki/Rejection_sampling
	private rejectionSample(): Organism {
		const randomOrganism: Organism = _.sample(this.population);

		if (Math.random() * this.best.fitness <= randomOrganism.fitness) {
			return randomOrganism;
		}

		return this.rejectionSample();
	}
}
