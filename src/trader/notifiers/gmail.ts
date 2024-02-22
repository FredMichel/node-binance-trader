import env from "../env"
import nodeMailer, { SentMessageInfo } from "nodemailer"
import { Notifier, NotifierMessage } from "../types/notifier"
import logger from "../../logger"

export default function (): Notifier {
    return {
        notify,
    }
}

const gmailAddress = env().NOTIFIER_GMAIL_ADDRESS
const gmailAppPassword = env().NOTIFIER_GMAIL_APP_PASSWORD

const mailTransport = nodeMailer.createTransport(
    `smtps://${encodeURIComponent(gmailAddress)}:${encodeURIComponent(
        gmailAppPassword
    )}@smtp.gmail.com`
)

async function notify(message: NotifierMessage): Promise<SentMessageInfo> {
    if (!env().IS_NOTIFIER_GMAIL_ENABLED) return

    return mailTransport
        .sendMail({
            from: "\"🐬  BVA \" <no-reply@gmail.com>",
            to: gmailAddress,
            subject: message.subject,
            text: message.content,
            html: message.contentHtml,
        })
        .catch((reason) => logger.error(`Failed to send mail: ${reason}`))
}
