import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/foxswap.svg";

function AboutUs() {
  return (
    <>
      <div className="flex px-2 mx-2 fixed mt-2 right-0 z-50">
        <Link to="/">
          <Button
            variant="primary"
            className="btn button rounded-btn btn-md side-button"
          >
            Home
          </Button>
        </Link>
      </div>
      <div className="h-screen bg-base-300 justify-items-center w-screen">
        <div className="flex grid justify-items-center ">
          <div className="text-3xl lg:text-6xl heroFont flex p-4">
            <div className="flex justify-center mt-4 me-5">
              <img src={logo} className="card-image" />
            </div>
            <p className="mt-4 text-5xl mr-10 ml-10 text-center">
              Locked Token Trading
            </p>
            <div className="flex justify-center mt-4 ps-5">
              <img src={logo} className="card-image" />
            </div>
          </div>
        </div>
        <div className="hero flex-col w-screen bg-base-300">
          <div className="hero-content flex flex-col mt-2">
            {/* <div className='block focus:outline-none p-3 w-1/2 bg-primary text-white w-full rounded-lg text-lg font-semibold mb-0' role="button">Q: What is 'OTC'? */}
            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>Q: What is FoxEscrow?</Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: Projects in DeFi space often structure their tokenomics so
                  that partial amount of rewards for early supporters are vested
                  or locked for certain (often long) periods. As these projects’
                  development progresses, these locked assets become valuable,
                  as in essence, they’ve become akin to future derivatives
                  instruments very well known in traditional financial markets.
                  <br />
                  This has created true need to trade those assets with
                  participants exchanging those tokens OTC. Unfortunately, due
                  to nature of how those locked tokens work, the trades require
                  level of trust between buyer/seller as they needed to send the
                  tokens and payments directly between each other.
                  <br />
                  People behind FoxSwap created originally tool to transfer
                  locked tokens as well as manual escrow service facilitated by
                  trusted 3rd party in order to minimise risk of fraud by any of
                  trading partners.
                  <br />
                  By launching FoxEscrow, we are taking it step further, where
                  the trades can be facilitated fully automatic with power of
                  smart contracts.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>
                  Q: Why did you develop FoxEscrow?
                </Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: Decentralised Finance (DeFi) is on its way, if not replace,
                  to compliment traditional financial markets. In those markets,
                  derivative contracts (like futures or options) are widely used
                  instruments, which are tied to underlying asset. For example a
                  call or put option allows holder to buy or sell an asset at a
                  price within specified (future) time frame.
                  <br />
                  <p>
                    We have noticed that locked tokens, as described above, have
                    similar properties. We also fully believe in the power of
                    DeFi, thus we want to bring the opportunity to trade such
                    locked assets to anyone participating in DeFi on blockchain.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>Q: How does FoxEscrow work?</Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: TBD
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>
                  Q: How much does it cost to use FoxEscrow?
                </Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: The fee to use FoxEscrow service is 1.2% of total value of
                  the trade. It’s less than half of what similar services
                  currently offer.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>Q: Is FoxEscrow audited?</Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: Yes, our code is audited by QuillHash, audit report
                  available HERE (link).
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>
                  Q: I have used your manual escrow service before, can I still
                  do that?
                </Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: Yes, it’s still possible to use our manual escrow service,
                  just reach out to us like before. Note that for manual escrow
                  service default fee is 2%. You can of course reach out to us
                  for special cases.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion
              className="block p-3 w-1/2 text-white w-full rounded-lg text-lg font-semibold mb-0 "
              flush
            >
              <Accordion.Item eventKey="0" className="font-semibold text-white">
                <Accordion.Header>
                  Q: Other questions? Want other tokens to be listed for escrow?
                </Accordion.Header>
                <Accordion.Body className="bg-base-200 rounded-lg text-sm">
                  A: If you have other questions about our services, or if you
                  want to ask for other locked tokens to be made available for
                  trading at FoxEscrow please reach out to us on discord or
                  telegram.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* <span className='float-right'>
                                <svg stroke="currentColor" fill="white" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" class="mt-1 h-4">
                                    <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z">

                                    </path>
                                </svg>
                            </span> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
