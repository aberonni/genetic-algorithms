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
	private totalFitness: number;
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
		this.totalFitness = 0;
		let bestOrganism: Organism;

		this.population.forEach((organism) => {
			organism.updateFitness();

			this.totalFitness += organism.fitness;

			if (!bestOrganism || organism.fitness > bestOrganism.fitness) {
				bestOrganism = organism;
			}

			console.log(organism.toString());
		});

		this.best = bestOrganism;

		if (this.idealFitness && this.best.fitness === this.idealFitness) {
			this.complete = true;
		}

		this.averageFitness = this.totalFitness / this.size;
	}

	public reproduce() {
		const newPopulation = [];

		for (let i = 0; i < this.size; i++) {
			// pick two parents
			const partnerA = this.weightedRandom();
			const partnerB = this.weightedRandom();
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

	private weightedRandom(): Organism {
		let r = Math.random() * this.totalFitness;

		for (let i = 0; i < this.size; i++) {
			r -= this.population[i].fitness;

			if (r <= 0) {
				return this.population[i];
			}
		}
	}
}
