import { ClientListMapbox } from "@/features/mapbox/mapbox-client-list";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./clientlist.css";
import type { PublicList } from "./types";

const API_URL = import.meta.env.VITE_API_URL as string;

export default function ClientList() {
  const { uuid } = useParams<{ uuid: string }>();
  const [listData, setListData] = useState<PublicList | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!uuid) return;
    axios
      .get(`${API_URL}/client-list/${uuid}/`)
      .then(({ data }) => {
        setListData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [uuid]);

  useEffect(() => {
    ClientListMapbox(listData, mapRef)
  }, [listData]);

  if (loading) {
    return (
      <div className="clientListPage">
        <nav className="clientListNav"><span className="clientListLogo">perihelion</span></nav>
        <div className="clientListStatus"><p>Loading...</p></div>
      </div>
    );
  }

  if (error || !listData) {
    return (
      <div className="clientListPage">
        <nav className="clientListNav"><span className="clientListLogo">perihelion</span></nav>
        <div className="clientListStatus">
          <h2>List Not Found</h2>
          <p>This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const sortedOptions = [...listData.options].sort((a, b) => a.order - b.order);

  return (
    <div className="clientListPage">
      <nav className="clientListNav">
        <span className="clientListLogo">perihelion</span>
      </nav>

      <div className="clientListBody">
        <div className="clientListHeading">
          <h1>Property Options for {listData.client_name}</h1>
          <p>Prepared by {listData.agent_name}</p>
        </div>

        <div className="clientListGrid">
          <div className="clientListOptionsCol">
            {sortedOptions.map((opt, idx) => (
              <div key={opt.id} className="publicOptionCard">
                <div className="publicOptionHeader">
                  <div className="publicOptionAddress">
                    {idx + 1}. {opt.address}
                  </div>
                  <div className="publicOptionBorough">{opt.prop_name}</div>
                </div>
                <div className="publicOptionDetails">
                  {opt.price && (
                    <div className="publicOptionStat">
                      <span className="publicOptionStatLabel">Price</span>
                      <span className="publicOptionStatValue">${opt.price}/mo</span>
                    </div>
                  )}
                  {opt.unit_number && (
                    <div className="publicOptionStat">
                      <span className="publicOptionStatLabel">Unit</span>
                      <span className="publicOptionStatValue">{opt.unit_number}</span>
                    </div>
                  )}
                  {opt.layout && (
                    <div className="publicOptionStat">
                      <span className="publicOptionStatLabel">Layout</span>
                      <span className="publicOptionStatValue">{opt.layout}</span>
                    </div>
                  )}
                  {opt.sq_ft && (
                    <div className="publicOptionStat">
                      <span className="publicOptionStatLabel">Sq Ft</span>
                      <span className="publicOptionStatValue">{opt.sq_ft}</span>
                    </div>
                  )}
                  {opt.available && (
                    <div className="publicOptionStat">
                      <span className="publicOptionStatLabel">Available</span>
                      <span className="publicOptionStatValue">{opt.available}</span>
                    </div>
                  )}
                </div>
                {opt.notes && <div className="publicOptionNotes">{opt.notes}</div>}
              </div>
            ))}
          </div>

          <div className="clientListMapCol">
            <div className="clientListMapBox" ref={mapRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
