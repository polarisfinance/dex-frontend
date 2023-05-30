import { initSafeConnector } from './safe';
import { initMetamaskConnector } from './metamask';
import { initTallyConnector } from './tally';
import { initWalletconnectConnector } from './walletconnect';
import { initWalletLinkConnector } from './walletlink';
import { initSenderConnector } from './sender';

export function initWalletConnectors() {
  initWalletconnectConnector();
  initMetamaskConnector();
  initSafeConnector();
  initWalletLinkConnector();
  initTallyConnector();
  initSenderConnector();
}
