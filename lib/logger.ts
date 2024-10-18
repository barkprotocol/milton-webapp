export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString(); // Adding a timestamp
    return `[${timestamp}] [${this.context}] ${level}: ${message} ${args.length ? JSON.stringify(args) : ''}`;
  }

  info(message: string, ...args: any[]) {
    console.log(this.formatMessage('INFO', message, ...args));
  }

  error(message: string, ...args: any[]) {
    console.error(this.formatMessage('ERROR', message, ...args));
  }

  warn(message: string, ...args: any[]) {
    console.warn(this.formatMessage('WARN', message, ...args));
  }

  debug(message: string, ...args: any[]) {
    console.debug(this.formatMessage('DEBUG', message, ...args));
  }
}
