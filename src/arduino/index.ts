import { EventEmitter } from 'events'
import utils from '../utils'
import { Arm } from './Arm'
import { BarCodeReader } from './BarCodeReader'
import { board, delay } from './board'
import { RFID } from './RFID'
import { StepMotor } from './StepMotor'
const debug = utils.debug('arduino')

export class Arduino extends EventEmitter {
  public arm = new Arm(this)
  public barCodeReader = new BarCodeReader(this)
  public rfid = new RFID(this)
  public stepper = new StepMotor(this)
  public board = board(utils.config.arduino.path)

  constructor () {
    super()
    this.board.on('ready', this.main)
  }

  private main () {
    debug('Ready!')
    // setInterval(this.loop, 100)
  }

  // private loop () {
  //   // TODO: Update RFID value
  // }

  async getBook (id: string): Promise<boolean> {
    debug('Getting book...')
    let directSense = true
    while (await this.barCodeReader.getCode() !== id) {
      await this.stepper.step(!directSense)
      if (this.stepper.reachedEdge() && directSense === false) {
        debug('Could not find book!')
        return false // Could not find it :(
      } else if (this.stepper.reachedEdge()) {
        debug('Could not found in the first direction, returning and trying again...')
        directSense = false
      }
      await delay(1)
    }
    await this.arm.extend()
    await delay(1000)
    this.arm.retract()
    await this.stepper.reset()
    return true
  }
}

export const arduino = new Arduino()