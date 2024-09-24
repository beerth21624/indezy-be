"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnomalousPowerMetric = generateAnomalousPowerMetric;
function generateAnomalousPowerMetric(index) {
    // Constants
    const NOMINAL_VOLTAGE = 230;
    const NOMINAL_FREQUENCY = 50;
    const MAX_CURRENT = 100;
    // Helper functions
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const roundTo = (num, places) => Number(num.toFixed(places));
    // Anomaly generation function
    const generateAnomaly = (normalValue, anomalyFactor = 2) => {
        const isAnomaly = Math.random() < 0.1; // 10% chance of anomaly
        return isAnomaly ? normalValue * anomalyFactor : normalValue;
    };
    // Generate base values with potential anomalies
    const voltageVariation = generateAnomaly(randomInRange(-0.1, 0.1), 3);
    const currentA1 = generateAnomaly(roundTo(randomInRange(0, MAX_CURRENT), 2));
    const currentA2 = generateAnomaly(roundTo(randomInRange(0, MAX_CURRENT), 2));
    const currentA3 = generateAnomaly(roundTo(randomInRange(0, MAX_CURRENT), 2));
    // Calculate derived values
    const voltageV1n = roundTo(NOMINAL_VOLTAGE * (1 + voltageVariation), 1);
    const voltageV2n = roundTo(NOMINAL_VOLTAGE * (1 + generateAnomaly(randomInRange(-0.05, 0.05), 3)), 1);
    const voltageV3n = roundTo(NOMINAL_VOLTAGE * (1 + generateAnomaly(randomInRange(-0.05, 0.05), 3)), 1);
    const voltageV12 = roundTo(Math.sqrt(3) * voltageV1n, 1);
    const voltageV23 = roundTo(Math.sqrt(3) * voltageV2n, 1);
    const voltageV31 = roundTo(Math.sqrt(3) * voltageV3n, 1);
    const voltageAverageVln = roundTo((voltageV1n + voltageV2n + voltageV3n) / 3, 1);
    const voltageAverageVll = roundTo((voltageV12 + voltageV23 + voltageV31) / 3, 1);
    const currentAvg = roundTo((currentA1 + currentA2 + currentA3) / 3, 2);
    const currentAn = roundTo(Math.sqrt(currentA1 ** 2 + currentA2 ** 2 + currentA3 ** 2), 2);
    const activePowerW1 = roundTo(voltageV1n * currentA1 * generateAnomaly(randomInRange(0.8, 1), 1.5), 0);
    const activePowerW2 = roundTo(voltageV2n * currentA2 * generateAnomaly(randomInRange(0.8, 1), 1.5), 0);
    const activePowerW3 = roundTo(voltageV3n * currentA3 * generateAnomaly(randomInRange(0.8, 1), 1.5), 0);
    const activePowerT = roundTo(activePowerW1 + activePowerW2 + activePowerW3, 0);
    const apparentPowerVa1 = voltageV1n * currentA1;
    const apparentPowerVa2 = voltageV2n * currentA2;
    const apparentPowerVa3 = voltageV3n * currentA3;
    const powerFactorPf1 = roundTo(generateAnomaly(activePowerW1 / apparentPowerVa1, 0.5), 3);
    const powerFactorPf2 = roundTo(generateAnomaly(activePowerW2 / apparentPowerVa2, 0.5), 3);
    const powerFactorPf3 = roundTo(generateAnomaly(activePowerW3 / apparentPowerVa3, 0.5), 3);
    const powerFactorT = roundTo((powerFactorPf1 + powerFactorPf2 + powerFactorPf3) / 3, 3);
    const reactivePowerVar1 = roundTo(Math.sqrt(apparentPowerVa1 ** 2 - activePowerW1 ** 2), 0);
    const reactivePowerVar2 = roundTo(Math.sqrt(apparentPowerVa2 ** 2 - activePowerW2 ** 2), 0);
    const reactivePowerVar3 = roundTo(Math.sqrt(apparentPowerVa3 ** 2 - activePowerW3 ** 2), 0);
    const reactivePowerT = roundTo(reactivePowerVar1 + reactivePowerVar2 + reactivePowerVar3, 0);
    const frequencyHz = roundTo(generateAnomaly(NOMINAL_FREQUENCY + randomInRange(-0.5, 0.5), 1.2), 2);
    const harmonicCurrentHiT = roundTo(generateAnomaly(randomInRange(0, 5), 3), 2);
    const harmonicVoltageHvT = roundTo(generateAnomaly(randomInRange(0, 3), 3), 2);
    const currentDemandDa1 = roundTo(currentA1 * generateAnomaly(randomInRange(0.9, 1.1), 1.5), 2);
    const currentDemandDa2 = roundTo(currentA2 * generateAnomaly(randomInRange(0.9, 1.1), 1.5), 2);
    const currentDemandDa3 = roundTo(currentA3 * generateAnomaly(randomInRange(0.9, 1.1), 1.5), 2);
    const currentDemandDan = roundTo((currentDemandDa1 + currentDemandDa2 + currentDemandDa3) / 3, 2);
    const currentDemandDavg = roundTo((currentDemandDa1 + currentDemandDa2 + currentDemandDa3) / 3, 2);
    const machineId = `machine-${Math.floor(randomInRange(1, 11))}`;
    return {
        currentAvg,
        voltageV31,
        activePowerW3,
        powerFactorPf2,
        id: `anomalous-${index}`,
        currentDemandDa1,
        voltageAverageVll,
        activePowerT,
        powerFactorPf3,
        currentDemandDa2,
        voltageV1n,
        reactivePowerVar1,
        powerFactorT,
        timestamp: new Date().toISOString(),
        currentDemandDa3,
        voltageV2n,
        reactivePowerVar2,
        frequencyHz,
        currentA1,
        currentDemandDan,
        voltageV3n,
        reactivePowerVar3,
        harmonicCurrentHiT,
        machineId,
        currentA2,
        currentDemandDavg,
        voltageAverageVln,
        reactivePowerT,
        harmonicVoltageHvT,
        currentA3,
        voltageV12,
        activePowerW1,
        powerFactorPf1,
        currentAn,
        voltageV23,
        activePowerW2,
        status: {
            machine_id: machineId,
            machine_name: `Anomalous Machine ${machineId.split("-")[1]}`,
            group: Math.floor(randomInRange(0, 5)),
            metric_id: `anomalous-${index}`,
            id: index,
            status: Math.floor(randomInRange(0, 5)),
            description: "Anomalous status description",
        },
    };
}
