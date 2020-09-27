// get something idk

const STAMINA_TICK_RATE = 40 //how many ms between stamina ticks
const CRAFTING_TICK_RATE = 100000 // how many ms between crafting ticks
let lastStamUpdate = new Date()
let lastCraftingUpdate = new Date()
function updateTimeEvents() {
	let now = new Date()
	let stamTimeElapsed = now - lastStamUpdate
	if (stamTimeElapsed > STAMINA_TICK_RATE) {
		// time to update stamina
		let numTicks = Math.floor(stamTimeElapsed / STAMINA_TICK_RATE)
		globalIncreaseStam(numTicks)
		let leftovers = stamTimeElapsed % STAMINA_TICK_RATE
		lastStamUpdate = now - leftovers
	}
}

function globalIncreaseStam(numTicks) {
	// to do
}
