//Takes a Castellum resource configuration and checks if it conforms to the
//format generated by this UI. Possible return values:
//
//  { custom: false, value: null }  -> autoscaling not enabled
//  { custom: false, value: <int> } -> autoscaling enabled through this UI
//  { custom: true }                -> autoscaling enabled through other Castellum client
export const parseConfig = (config) => {
  if (!config) {
    return { custom: false, value: null, minFree: null }
  }
  if (!config.size_steps.single) {
    return { custom: true }
  }

  if (
    !config.low_threshold ||
    !config.critical_threshold ||
    config.high_threshold
  ) {
    return { custom: true }
  }
  const { usage_percent: lowPerc, delay_seconds: lowSecs } =
    config.low_threshold
  const { usage_percent: criticalPerc } = config.critical_threshold
  if (lowSecs != 60) {
    return { custom: true }
  }
  const expectedLowPerc = criticalPerc - 0.1
  //`if (lowPerc != expectedLowPerc)` does not always work as expected because
  //of rounding errors in previous operations; e.g. 99.9 - 50 = 49.900000000006
  //instead of 49.9
  if (Math.abs(lowPerc - expectedLowPerc) > 0.000001) {
    return { custom: true }
  }
  return {
    custom: false,
    value: 100 - criticalPerc,
    minFree: config?.size_constraints?.minimum_free,
  }
}

//Generate a Castellum resource configuration that parseConfig() recognizes.
export const generateConfig = (value, minFree) => ({
  low_threshold: { usage_percent: 99.9 - value, delay_seconds: 60 },
  critical_threshold: { usage_percent: 100 - value },
  size_steps: { single: true },
  size_constraints: minFree ? { minimum_free: minFree } : undefined,
})

export const isUnset = (value) =>
  value === null ||
  Number.isNaN(value) ||
  value === "" ||
  typeof value === "undefined"
