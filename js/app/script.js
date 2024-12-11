const population = 600;
let tedadYeksan = 50;
const crossOverProbability = 0.9;
const mutationProbability = 0.1;
let maxGen = 2000;

const resultSpan = document.getElementById("resultSpan")
const pathspan = document.getElementById("pathspan")

const points = [
    [1, 37, 52], [2, 49, 49], [3, 52, 64], [4, 20, 26], [5, 40, 30], [6, 21, 47],
    [7, 17, 63], [8, 31, 62], [9, 52, 33], [10, 51, 21], [11, 42, 41], [12, 31, 32],
    [13, 5, 25], [14, 12, 42], [15, 36, 16], [16, 52, 41], [17, 27, 23], [18, 17, 33],
    [19, 13, 13], [20, 57, 58], [21, 62, 42], [22, 42, 57], [23, 16, 57], [24, 8, 52],
    [25, 7, 38], [26, 27, 68], [27, 30, 48], [28, 43, 67], [29, 58, 48], [30, 58, 27],
    [31, 37, 69], [32, 38, 46], [33, 46, 10], [34, 61, 33], [35, 62, 63], [36, 63, 69],
    [37, 32, 22], [38, 45, 35], [39, 59, 15], [40, 5, 6], [41, 10, 17], [42, 21, 10],
    [43, 5, 64], [44, 30, 15], [45, 39, 10], [46, 32, 39], [47, 25, 32], [48, 25, 55],
    [49, 48, 28], [50, 56, 37], [51, 30, 40]
];

const maxRange = points.length;

let generation = 0;
let chromosomes = new Array(population);
let fitnesses = new Array(population);

const fittnessFunc = x => {
    let sum = 0;

    for (let i = 0; i < x.length - 1; i++) {
        sum += findTheDistance(x[i] - 1, x[i + 1] - 1); 
    }

    sum += findTheDistance(x[x.length - 1] - 1, x[0] - 1);

    return sum;
};

let distanceMatrix = Array.from({ length: points.length }, () => Array(points.length).fill(0));

function calculateDistanceMatrix() {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const dx = points[i][1] - points[j][1];
                const dy = points[i][2] - points[j][2];
                distanceMatrix[i][j] = Math.sqrt(dx * dx + dy * dy);
            }
        }
    }
}

function findTheDistance(a, b) {
    if (a < 0 || b < 0 || a >= points.length || b >= points.length) {
        throw new Error(`Invalid index: ${a + 1} or ${b + 1}`);
    }
    return distanceMatrix[a][b];
}

const crossingOver = (x, y) => {
    let crossPoint1, crossPoint2;
    do {
        crossPoint1 = Math.floor(Math.random() * x.length);
        crossPoint2 = Math.floor(Math.random() * x.length);
    } while (crossPoint1 === crossPoint2);


    let start = Math.min(crossPoint1, crossPoint2);
    let end = Math.max(crossPoint1, crossPoint2);

    const slicemiddle1 = x.slice(start, end);
    const slicemiddle2 = y.slice(start, end);

    const offspring1 = Array(x.length).fill(null);
    const offspring2 = Array(y.length).fill(null);

    for (let i = start; i < end; i++) {
        offspring1[i] = x[i];
        offspring2[i] = y[i];
    }

    let idx1 = end % x.length;
    for (let i = 0; i < y.length; i++) {
        const value = y[(end + i) % y.length];
        if (!slicemiddle1.includes(value)) {
            offspring1[idx1] = value;
            idx1 = (idx1 + 1) % x.length;
        }
    }

    let idx2 = end % y.length;
    for (let i = 0; i < x.length; i++) {
        const value = x[(end + i) % x.length];
        if (!slicemiddle2.includes(value)) {
            offspring2[idx2] = value;
            idx2 = (idx2 + 1) % y.length;
        }
    }


    return [offspring1, offspring2];
};

const mutation = (x) => {
    const mutationPoint1 = Math.floor(Math.random() * ((x.length - 1) / 2)) + 1;
    const mutationPoint2 = Math.floor(Math.random() * ((x.length - 1) / 2)) + Math.ceil((x.length - 1) / 2);

    let temp = x[mutationPoint1]
    x[mutationPoint1] = x[mutationPoint2]
    x[mutationPoint2] = temp

    return x;

};

let fitnessData = [];

let minFitnesses = [];


function makeChromosome() {
    let path = []
    for (let i = 1; i <= maxRange; i++) {
        path.push(i)
    }

    let randNum = Math.floor(Math.random() * (maxRange / 2));

    for (let i = 0; i < randNum; i++) {
        let num1 = Math.floor(Math.random() * maxRange)
        let num2 = Math.floor(Math.random() * maxRange)
        while (num1 == num2) {
            num2 = Math.floor(Math.random() * maxRange)
        }
        let temp = path[num1]
        path[num1] = path[num2]
        path[num2] = temp;
    }

    return path

}

const canvas = document.getElementById('coordinateCanvas');
const ctx = canvas.getContext('2d');

const scaleX = 10;
const scaleY = 10;

function drawPoints() {
    points.forEach(([id, x, y]) => {
        const canvasX = x * scaleX;
        const canvasY = canvas.height - (y * scaleY);

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${generateRandomHexColor()}`;
        ctx.fill();

        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(id, canvasX + 6, canvasY - 12);
    });
}

function generateRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 معادل 0xFFFFFF است
    return "#" + randomColor.padStart(6, '0');
}

function drawPath(path) {
    ctx.beginPath();

    for (let i = 0; i < path.length; i++) {
        const pointIndex = path[i] - 1;
        const [id, x, y] = points[pointIndex];
        const canvasX = x * scaleX;
        const canvasY = canvas.height - (y * scaleY);

        if (i === 0) {
            ctx.moveTo(canvasX, canvasY);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#ff0000';
            ctx.fillText('-->Start-End<--', canvasX + 40, canvasY - 22);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.closePath();
    ctx.strokeStyle = '#207875';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function tournamentSelection(fitnesses, chromosomes, tournamentSize) {
    let tournamentIndexes = new Set();

    while (tournamentIndexes.size < tournamentSize) {
        let randIndex = Math.floor(Math.random() * fitnesses.length);
        tournamentIndexes.add(randIndex);
    }

    let bestIndex = [...tournamentIndexes].reduce((best, current) => {
        return fitnesses[current] < fitnesses[best] ? current : best;
    });

    return chromosomes[bestIndex];
}

function theMethod() {

    for (let i = 0; i < population; i++) {
        chromosomes[i] = makeChromosome();
        fitnesses[i] = fittnessFunc(chromosomes[i]);
    }

    let crossCount = Math.floor((population / 2) * crossOverProbability);
    let flag = true;
    let samplePath = [];

    while (flag) {
        let newPopulation = [];
        let selectedParents = new Set();
        let minfitt = Math.min(...fitnesses);
        let elitisimIndex = fitnesses.indexOf(minfitt);


        for (let i = 0; i < crossCount; i++) {
            let parent1 = tournamentSelection(fitnesses, chromosomes, 3); // اولین والد
            let parent2 = tournamentSelection(fitnesses, chromosomes, 3); // دومین والد

            while (parent1 === parent2 && (chromosomes.indexOf(parent1) != elitisimIndex && chromosomes.indexOf(parent2) != elitisimIndex)) {
                parent2 = tournamentSelection(fitnesses, chromosomes, 3);
            }

            const [child1, child2] = crossingOver(parent1, parent2);

            newPopulation.push(child1, child2);
        }

        let mutationCount = Math.floor(newPopulation.length * mutationProbability);
        for (let i = 0; i < mutationCount; i++) {
            let randomIndex = Math.floor(Math.random() * newPopulation.length);
            newPopulation[randomIndex] = mutation(newPopulation[randomIndex]);
        }

        chromosomes.forEach((chromosome, index) => {
            if (!selectedParents.has(index) && newPopulation.length < population) {
                newPopulation.push(chromosome);
            }
        });

        chromosomes = [...newPopulation];

        for (let i = 0; i < population; i++) {
            fitnesses[i] = fittnessFunc(chromosomes[i]);
        }

        let minfittness = Math.min(...fitnesses);
        let minIndex = fitnesses.indexOf(minfittness);
        samplePath = [...chromosomes[minIndex]];

        minFitnesses.push(minfittness);
        resultSpan.innerHTML = minfittness.toFixed(2);
        fitnessData.push(minfittness);

        if (minFitnesses.length >= tedadYeksan) {
            let recentFitnesses = minFitnesses.slice(-tedadYeksan).map(fit => Number(fit.toFixed(2)));
            if (recentFitnesses.length === tedadYeksan && recentFitnesses.every(fit => fit === recentFitnesses[0])) {
                flag = false;
                console.log("Stopping condition met!");
            }
        }

        console.log(minfittness);

        generation++;

        if(generation === maxGen){
            flag=false
        }
    }
    drawPoints();
    drawPath(samplePath);
    pathspan.innerHTML = samplePath.join(" -> ");


    const ctx1 = document.getElementById('fitnessChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: Array.from({ length: fitnessData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Fitness Over Generations',
                data: fitnessData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
calculateDistanceMatrix();

theMethod();
