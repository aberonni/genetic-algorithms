class Organism {
	public fitness: number;
	public weight: number;

	private size: number;
	private newGene: () => string;
	private calculateFitness: (genes: string[]) => number;
	private genes: string[];

	constructor(size, newGene, calculateFitness, genes = null) {
		this.size = size;
		this.newGene = newGene;
		this.calculateFitness = calculateFitness;

		this.fitness = 0;

		if (!genes) {
			this.genes = [];

			for (let i = 0; i < size; i++) {
				this.genes[i] = this.newGene();
			}
		} else {
			this.genes = genes;
		}
	}

	public toString() {
		return this.genes.join('');
	}

	public updateFitness() {
		this.fitness = this.calculateFitness(this.genes);
	}

	public crossover(partner) {
		const genes = [];

		for (let i = 0; i < this.size; i++) {
			if (Math.random() >= 0.5) {
				genes[i] = this.genes[i];
			} else {
				genes[i] = partner.genes[i];
			}
		}

		return new Organism(this.size, this.newGene, this.calculateFitness, genes);
	}

	public mutate(mutationRate) {
		for (let i = 0; i < this.size; i++) {
			if (Math.random() < mutationRate) {
				this.genes[i] = this.newGene();
			}
		}
	}
}

export default Organism;
