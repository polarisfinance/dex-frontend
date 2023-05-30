import { SenderConnector } from '@/services/web3/connectors/sender/sender.connector';
import { handleDependencyError } from '..';

let _senderConnector;

/**
 * Uses the real sender connector instance by default but allows injecting sender connector mocks from tests
 */
export async function initSenderConnector() {
  if (!_senderConnector) {
    // Lazy load dependency to reduce initial bundle size
    const { SenderConnector } = await import(
      '@/services/web3/connectors/sender/sender.connector'
    );
    _senderConnector = SenderConnector;
  }
}

export async function initSenderConnectorForTesting(senderConnector) {
  _senderConnector = senderConnector;
}

export function getSenderConnector(): SenderConnector {
  if (!_senderConnector) {
    handleDependencyError('SenderConnector');
  }
  return _senderConnector;
}
