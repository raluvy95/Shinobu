export let deconstruct = async (snowflake: string) => {
  return Math.floor(Number(snowflake) / 4194304) + 1420070400000;
}
