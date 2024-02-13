import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  formatDuration,
} from "date-fns"

const CountdownTimer = (targetDate: Date) => {
  const calcCountDown = (targetDate: Date) => {
    const now = new Date()
    const remainingDays = differenceInDays(now, targetDate)
    const remainingHours = differenceInHours(now, targetDate) % 24
    const remainingMinutes = differenceInMinutes(now, targetDate) % 60
    const remainingSeconds = differenceInSeconds(now, targetDate) % 60

    const countdownMessage = formatDuration(
      {
        days: remainingDays,
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
      },
      { delimiter: ", " }
    )

    return countdownMessage
  }

  const message = calcCountDown(targetDate)

  return <p>Time remaining: {message}</p>
}

export default CountdownTimer
