import React, { useContext, useState, useEffect, useRef } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

import { QueryPreservingLink } from "src/services/network/networkProvider";
import InfoTabs from "src/components/DetailsPages/Misc/InfoTabs/InfoTabs";
import DefaultTab from "src/components/DetailsPages/Misc/InfoTabs/DefaultTab";
import CodeTab from "src/components/DetailsPages/Misc/InfoTabs/CodeTab";
import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { NetworkContext } from "src/services/network/networkProvider";
import { ContractData } from "src/typings/api";
import { qaToZil } from "src/utils/Utils";

import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InitParamsTab from "../../Misc/InfoTabs/InitParamsTab";
import ContractTransactionsTab from "./ContractTransactionsTab";
import LabelStar from "../../Misc/LabelComponent/LabelStar";
import ViewBlockLink from "../../Misc/ViewBlockLink/ViewBlockLink";

import "../AddressDetailsPage.css";

interface IProps {
  addr: string;
}

const ContractDetailsPage: React.FC<IProps> = ({ addr }) => {
  const networkContext = useContext(NetworkContext);
  const { dataService, isIsolatedServer, networkUrl } = networkContext!;

  const addrRef = useRef(addr);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [creationTxnHash, setCreationTxnHash] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionsCount, setTransactionsCount] = useState<number>(0);

    const isFungibleToken = (contractData: ContractData) => {
      const symbol = contractData.initParams.find(
        (item) => item.vname === "symbol"
      );
      const name = contractData.initParams.find(
        (item) => item.vname === "name"
      );
      const init_supply = contractData.initParams.find(
        (item) => item.vname === "init_supply"
      );
      const decimals = contractData.initParams.find(
        (item) => item.vname === "decimals"
      );

      if (symbol && name && init_supply && decimals) {
        const holders = Object.keys(contractData.state.balances).length;
        /* const holds = Object.values(contractData.state.balances);

      const init_value = typeof (init_supply.value === "string")
        ? parseFloat(init_supply.value)
        : 0;

      console.log(holds);
      const supply =
        init_value -
        (holds.length
          ? holds.reduce(
              (prev: number, current: any) => prev + parseFloat(current),
              0
            )
          : 0); */

        return {
          symbol,
          name,
          init_supply,
          decimals,
          holders,
        };
      }
      return false;
    };

    const fungibleToken = contractData ? isFungibleToken(contractData) : false;


  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    if (!dataService || isIsolatedServer === null) return;

    let contractData: ContractData;
    let creationTxnHash: string;
    let owner: string;
    const getData = async () => {
      try {
        if (isIsolatedServer) {
          contractData = await dataService.getContractData(addrRef.current);
        } else {
          contractData = await dataService.getContractData(addrRef.current);
          creationTxnHash = await dataService.getTxnIdFromContractData(
            contractData
          );
          owner = await dataService.getTransactionOwner(creationTxnHash);
        }
        if (contractData) setContractData(contractData);
        if (creationTxnHash) setCreationTxnHash(creationTxnHash);
        if (owner) setOwner(owner);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [dataService, isIsolatedServer]);

  const generateTabsObj = () => {
    const tabs: {
      tabHeaders: string[];
      tabTitles: string[];
      tabContents: React.ReactNode[];
    } = {
      tabHeaders: [],
      tabTitles: [],
      tabContents: [],
    };

    if (!contractData) return tabs;

    tabs.tabHeaders.push("transactions");
    tabs.tabTitles.push("Transactions");
    tabs.tabContents.push(
      <ContractTransactionsTab
        initParams={contractData.initParams}
        contractAddr={addrRef.current}
        fungibleToken={fungibleToken}
        onTransactionsCount={setTransactionsCount}
      />
    );

    tabs.tabHeaders.push("initParams");
    tabs.tabTitles.push("Init Parameters");
    tabs.tabContents.push(
      <InitParamsTab initParams={contractData.initParams} />
    );

    tabs.tabHeaders.push("State");
    tabs.tabTitles.push("State");
    tabs.tabContents.push(<DefaultTab content={contractData.state} />);

    tabs.tabHeaders.push("code");
    tabs.tabTitles.push("Code");
    tabs.tabContents.push(<CodeTab code={contractData.code} />);

    return tabs;
  };

  return (
    <>
      {isLoading ? (
        <div className="center-spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {contractData && (
        <>
          <div className="address-header">
            <h3 className="mb-1">
              <span className="mr-1">
                <FontAwesomeIcon className="fa-icon" icon={faFileContract} />
              </span>
              <span className="ml-2">Contract</span>
              <LabelStar type="Contract" />
            </h3>
            <ViewBlockLink
              network={networkUrl}
              type="address"
              identifier={addrRef.current}
            />
          </div>
          <div className="subtext">
            <AddressDisp isLinked={false} addr={addrRef.current} />
          </div>
          <Card className="address-details-card">
            <Card.Body>
              <Container>
                <Row className="mb-4">
                  <Col>
                    <div className="subtext text-small">Balance</div>
                    <div>{qaToZil(contractData.state["_balance"])}</div>
                  </Col>
                  <Col>
                    <div className="subtext text-small">Transactions</div>
                    <div>{transactionsCount}</div>
                  </Col>
                  {fungibleToken ? (
                    <>
                      <Col>
                        <div className="subtext text-small">Token Info</div>
                        <div>
                          {fungibleToken.name.value} <br />
                          {fungibleToken.symbol.value}
                        </div>
                      </Col>
                      <Col>
                        <div className="subtext text-small">Token Holders</div>
                        <div>{fungibleToken.holders}</div>
                      </Col>
                      <Col>
                        <div className="subtext text-small">
                          Token Transfers
                        </div>
                        <div></div>
                      </Col>
                      <Col>
                        <div className="subtext text-small">Token Supply</div>
                        <div>{fungibleToken.init_supply.value}</div>
                      </Col>
                    </>
                  ) : null}
                </Row>
                {creationTxnHash && (
                  <>
                    <Row className="mb-0">
                      <Col>
                        <div>
                          <span className="mr-2">Contract Creation:</span>
                          <span className="pl-2">
                            <QueryPreservingLink to={`/tx/${creationTxnHash}`}>
                              {creationTxnHash}
                            </QueryPreservingLink>
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </Container>
            </Card.Body>
          </Card>
          <InfoTabs tabs={generateTabsObj()} />
        </>
      )}
    </>
  );
};

export default ContractDetailsPage;
