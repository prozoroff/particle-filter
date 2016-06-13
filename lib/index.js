'use strict';
module.exports = particleFilter;

function nextDouble(maxValue, minValue) {
    var max = maxValue || 1,
        min = minValue || 0,
        randomValue = Math.random();
    if (!min) {
        return randomValue * max;
    }
    return (0.5 - randomValue) * (max - min);
}

function uniformDistribution(maxValue) {
    this.maxValue = maxValue;
}

uniformDistribution.prototype.generate = function () {
    return nextDouble(this.maxValue);
}

function featureParticle(state, weight, variance) {
    var defaultVariance = 50;

    this.variance = variance || defaultVariance;
    this.weight = weight || 0;
    this.state = state.slice();
};

featureParticle.prototype.diffuse = function () {
    var state = this.state,
        variance = this.variance;

    for (var i = 0, l = state.length; i < l; i++) {
        state[i] += nextDouble(variance, -variance);
    }
};

featureParticle.prototype.clone = function () {
    return new featureParticle(this.state.slice(), this.weight);
};

function particleFilter(particlesNumber, variablesNumber, distributionSize) {

    var particlesNumber = particlesNumber || 100,
        variablesNumber = variablesNumber || 1,
        distributionSize = distributionSize || 10;

    this.particles = [];
    this.epsilon = Number.MIN_VALUE;
    this.variance = 0;
    this.distributions = [];

    for (var i = 0; i < variablesNumber; i++) {
        this.distributions.push(new uniformDistribution(distributionSize));
    }

    this.generateParticles(particlesNumber, this.distributions);
};

particleFilter.prototype.generateParticles = function (numberOfParticles, distributions) {
    var nDim = distributions.length,
        particles = this.particles;
    for (var i = 0; i < numberOfParticles; i++) {
        var randomParam = [];
        for (var dim = 0; dim < nDim; dim++) {
            randomParam[dim] = distributions[dim].generate();
        }
        particles.push(new featureParticle(randomParam, 1 / numberOfParticles));
    }
};

particleFilter.prototype.resample = function (sampleCount) {
    var resampledParticles = [],
        filteredParticles = this.filter(this.particles.length);

    for (var i = 0, l = filteredParticles.length; i < l; i++) {
        var newPart = filteredParticles[i].clone();
        newPart.weight = 1 / this.particles.length;
        resampledParticles.push(newPart);
    }

    return resampledParticles;
};

particleFilter.prototype.filter = function (sampleCount) {
    var cumulativeWeights = [],
        cumSumInd = 0,
        cumSum = 0,
        particles = this.particles;

    for (var i = 0, l = particles.length; i < l; i++) {
        var p = particles[i];
        cumSum += p.weight;
        cumulativeWeights[cumSumInd++] = cumSum;
    }

    var maxCumWeight = cumulativeWeights[particles.length - 1],
        minCumWeight = cumulativeWeights[0];

    var filteredParticles = [];

    for (var i = 0; i < sampleCount; i++) {
        var randWeight = minCumWeight + nextDouble(1) * (maxCumWeight - minCumWeight),
            particleInd = 0;
        while (cumulativeWeights[particleInd] < randWeight) {
            particleInd++;
        }

        var p = particles[particleInd];
        filteredParticles.push(p);
    }

    return filteredParticles;
};

particleFilter.prototype.predict = function (effectiveMinRatio) {
    var newParticles,
        particles = this.particles,
        effectiveRatio = this.effectiveLength(this.normalWeights()) / this.particles.length;
    if (effectiveRatio > this.epsilon &&
        effectiveRatio < effectiveMinRatio) {
        newParticles = this.resample(particles.length);
    }
    else {
        newParticles = [];
        for (var i = 0, l = particles.length; i < l; i++) {
            var cloned = particles[i].clone();
            cloned.diffuse();
            newParticles.push(cloned);
        }
    }

    this.particles = newParticles;
};

particleFilter.prototype.effectiveLength = function (weights) {
    var sumSqr = this.epsilon,
        sum = 0;
    for (var i = 0, l = weights.length; i < l; i++) {
        var w = weights[i];
        sumSqr += w * w;
        sum += w;
    }

    return sum / sumSqr;
};

particleFilter.prototype.normalWeights = function () {
    var particles = this.particles,
        normalizedWeights = [],
        weightSum = this.epsilon;
    for (var i = 0, l = particles.length; i < l; i++) {
        weightSum += particles[i].weight;
    }

    for (var i = 0, l = particles.length; i < l; i++) {
        normalizedWeights.push(particles[i].weight / weightSum);
    }

    return normalizedWeights;
};

particleFilter.prototype.update = function (measure, effectiveMinRatio) {

    this.predict(effectiveMinRatio || 0.9);

    var particles = this.particles,
        maxWeightParticle;

    for (var i = 0, l = particles.length; i < l; i++) {
        var particle = particles[i],
            state = particle.state,
            sumSqr = 0;

        for (var j = 0, sl = state.length; j < sl; j++) {
            var diff = measure[j] - state[j];
            sumSqr += diff * diff;
        }

        var weight = 1 / Math.sqrt(sumSqr);
        particle.weight = weight;

        if (!maxWeightParticle || maxWeightParticle.weight < weight) {
            maxWeightParticle = particle;
        }
    }

    this.result = maxWeightParticle;
    return maxWeightParticle;
};

