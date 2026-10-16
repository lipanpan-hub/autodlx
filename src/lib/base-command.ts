import * as inquirer from '@inquirer/prompts'
import {Command} from '@oclif/core'
import {type Bindings, type Logger} from 'pino'

import {LoggerManager} from './logger/index.js'

export abstract class BaseCommand extends Command {
  // 交互选择默认超时秒数: 超时未操作则中断选择并报错退出
  private static readonly SELECT_TIMEOUT_SECONDS = 30

  // 交互填写参数的超时秒数: 填写是慢操作(需要思考/输入内容), 超时长于选择
  private static readonly INPUT_TIMEOUT_SECONDS = 60

  // 子类直接用 this.logger 记日志, scope 自动带上命令 id
  protected logger!: Logger

  // 交互 prompt 的超时看门狗骨架: 挂定时器, 超时通过 AbortSignal 中断 prompt 并报错退出 (timeoutHint 为报错时的操作指引)
  private async promptWithTimeout<T>(timeoutSeconds: number, timeoutHint: string, runPrompt: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const abortController = new AbortController()
    let isPromptTimedOut = false
    const promptTimeout = setTimeout(() => {
      isPromptTimedOut = true
      abortController.abort()
    }, timeoutSeconds * 1000)

    try {
      return await runPrompt(abortController.signal)
    } catch (error) {
      // 超时中断时给出明确指引; 其余错误(如 Ctrl+C)保持原有行为继续抛出
      if (isPromptTimedOut) {
        this.error(`等待操作超时 (${timeoutSeconds} 秒未操作), ${timeoutHint}`)
      }
      throw error
    } finally {
      clearTimeout(promptTimeout)
    }
  }

  // 带超时看门狗的交互式选择: 超时未操作则中断选择并报错退出
  protected async selectWithTimeout<T>(message: string, choices: ReadonlyArray<{name: string; value: T}>, timeoutHint: string): Promise<T> {
    return this.promptWithTimeout(BaseCommand.SELECT_TIMEOUT_SECONDS, timeoutHint, (signal) => inquirer.select({message, choices}, {signal}))
  }

  // 带超时看门狗的交互式文本输入: 超时未输入则中断并报错退出; defaultValue 直接回车时采用
  protected async inputWithTimeout(message: string, timeoutHint: string, defaultValue?: string): Promise<string> {
    return this.promptWithTimeout(BaseCommand.INPUT_TIMEOUT_SECONDS, timeoutHint, (signal) => inquirer.input({message, default: defaultValue}, {signal}))
  }

  protected async catch(error: Error & {exitCode?: number}): Promise<unknown> {
    // this.logger?.error({err: error}, `命令执行失败: ${error.message}`)
    return super.catch(error)
  }

  // 命令内部需要更细粒度的 scope 时用它派生, 例如 this.createLogger('downloader')
  protected createLogger(scope: string, bindings: Bindings = {}): Logger {
    return LoggerManager.instance.createChildLogger(`${this.id ?? this.constructor.name}:${scope}`, bindings)
  }

  // 轮询等待异步操作生效: 每隔 intervalMs 执行一次 check, 返回 true 即代表成功; 超过 timeoutMs 仍未成功返回 false
  protected async pollUntil(check: () => Promise<boolean>, intervalMs: number, timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      await new Promise<void>((resolveSleep) => {
        setTimeout(resolveSleep, intervalMs)
      })
      if (await check()) return true
    }
    return false
  }

  protected async finally(error: Error | undefined): Promise<unknown> {
    // 退出前必须等 transport worker 落盘, 否则短命进程会丢日志
    await LoggerManager.instance.shutdown()
    return super.finally(error)
  }

  async init(): Promise<void> {
    await super.init()

    LoggerManager.instance.init(this.config.configDir)
    this.logger = LoggerManager.instance.createChildLogger(this.id ?? this.constructor.name)
    this.logger.debug({argv: this.argv}, '命令开始执行')
  }
}
