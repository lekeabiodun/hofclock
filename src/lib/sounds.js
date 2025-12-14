/**
 * Play a countdown completion sound using Web Audio API
 */
export function playCountdownAlert() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        
        // Create a simple beep sound
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Configure the beep
        oscillator.frequency.value = 800 // Hz
        oscillator.type = 'sine'
        
        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        // Play the sound
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
        
        // Play three beeps
        setTimeout(() => {
            const osc2 = audioContext.createOscillator()
            const gain2 = audioContext.createGain()
            osc2.connect(gain2)
            gain2.connect(audioContext.destination)
            osc2.frequency.value = 800
            osc2.type = 'sine'
            gain2.gain.setValueAtTime(0, audioContext.currentTime)
            gain2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
            osc2.start(audioContext.currentTime)
            osc2.stop(audioContext.currentTime + 0.5)
        }, 200)
        
        setTimeout(() => {
            const osc3 = audioContext.createOscillator()
            const gain3 = audioContext.createGain()
            osc3.connect(gain3)
            gain3.connect(audioContext.destination)
            osc3.frequency.value = 1000
            osc3.type = 'sine'
            gain3.gain.setValueAtTime(0, audioContext.currentTime)
            gain3.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.01)
            gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
            osc3.start(audioContext.currentTime)
            osc3.stop(audioContext.currentTime + 0.8)
        }, 400)
        
    } catch (error) {
        console.error('Error playing countdown alert:', error)
    }
}
