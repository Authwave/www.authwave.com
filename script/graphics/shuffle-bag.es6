/** Each value is used once per shuffled round; avoid repeats at round boundaries. */
export class ShuffleBag {
	constructor(values, random = Math.random) {
		this.values = [...values];
		this.random = random;
		this.bag = [];
		this.last = undefined;
	}

	next() {
		if(!this.bag.length) {
			this.bag = [...this.values];
			for(let i = this.bag.length - 1; i > 0; i--) {
				const j = Math.floor(this.random() * (i + 1));
				[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
			}
			if(this.bag.length > 1 && this.bag.at(-1) === this.last) {
				[this.bag[0], this.bag[this.bag.length - 1]] = [this.bag.at(-1), this.bag[0]];
			}
		}
		this.last = this.bag.pop();
		return this.last;
	}
}
