import React, { useCallback } from "react";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { isValidAddr } from "src/utils/Utils";
import { EventParam } from "@zilliqa-js/core/src/types";

import "./EventsTab.css";

interface IProps {
  data: string;
}

const OverviewTab: React.FC<IProps> = ({ data }) => {
  const parsedData = JSON.parse(data);
  const tag = parsedData._tag;
  const params = tag ? parsedData.params : parsedData;
  const highlightEventParams = useCallback(
    (params: EventParam[]): React.ReactNode => {
      if (params.length === 0) return null;
      return params
        .map((param, index) => (
          <span key={index}>
            <span className="event-type">{param.type}</span> {param.vname}
          </span>
        ))
        .reduce((acc: React.ReactNode | null, ele) =>
          acc === null ? <>{[ele]}</> : <>{[acc, ", ", ele]}</>
        );
    },
    []
  );

  return (
    <>
      <div className="mt-1 mb-3">
        {tag ? (
          <>
            <span className="event-name">{tag}</span>
            {" ("}
            {highlightEventParams(params)}
            {")"}
          </>
        ) : (
          <span className="event-name">Contract Parameters</span>
        )}
      </div>

      <table className="receipt-table">
        <tbody>
          {params.length > 0 && (
            <>
              <tr>
                <td className="subtext">Variable</td>
                <td className="subtext">Value</td>
              </tr>
              {params.map((param: EventParam, index: number) => (
                <tr key={index}>
                  <th>{param.vname}</th>
                  <td>
                    {param.value !== undefined ? (
                      <div>
                        {typeof param.value === "object" ? (
                          <pre className="display-block">
                            {JSON.stringify(param.value, null, 2)}
                          </pre>
                        ) : Array.isArray(param.value) ? (
                          param.value.toString()
                        ) : isValidAddr(param.value.toString()) ? (
                          <AddressDisp isLinked={true} addr={param.value} />
                        ) : (
                          param.value
                        )}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default OverviewTab;
