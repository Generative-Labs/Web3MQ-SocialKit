// import { WalletContextProvider } from "./contexts/WalletContext";
// import { XmtpContextProvider } from "./contexts/XmtpContext";
// import Home from "./components/Home";
import { SocialClient } from './SocialKit'
import { useEffect } from "react";
import { Buffer } from "buffer";
import "./App.css";


// @ts-ignore
window.Buffer = Buffer;

function App() {

  async function testXmtp() {
    const client = await SocialClient.create('xmtp').init()
    const res = await client.sendMessage('hellow', '0x3F11b27F323b62B159D2642964fa27C46C841897')
    console.log(res)
  }

  async function testWeb3mq() {
    const client = await SocialClient.create('web3mq').init()
  }
  return (
    <div className="App">
       <section>
          <button onClick={testXmtp}>connect xmtp and send msg</button>
       </section>
       <section>
          <button onClick={testWeb3mq}>connect web3mq</button>
       </section>
    </div>
  );
}

export default App;
