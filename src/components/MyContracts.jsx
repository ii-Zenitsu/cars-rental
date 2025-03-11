import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import ContractPDF from "./ContractPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function MyContracts() {
    const user = useSelector(state => state.user);
    const cars = useSelector(state => state.cars);
    const contracts = useSelector(state => state.contracts);


    return (
        <div className="flex flex-wrap items-center justify-center gap-8 p-4 item" >
            {user.getContracts(contracts).map(c => (
            <div className="card max-w-lg w-full border-sh" key={c.id}>
                <div className="card-body p-6">
                  <div className="flex gap-4 justify-between items-center mb-6">
                    <div className="flex gap-2 items-center">
                      <h1 className="text-3xl text-center">Contract ID</h1>
                      <span className="badge badge-outline badge-lg mt-1">{c.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Car ID<span className="badge badge-outline mb-1.5 ml-3">{c.getCar(cars).id}</span></div>
                    <div >{c.getCar(cars).getName()}</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Client ID<span className="badge badge-outline mb-1.5 ml-3">{user.id}</span></div>
                    <div>{user.getFullName()}</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Start Date</div>
                    <div>{c.startDate}</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">End Date</div>
                    <div>{c.endDate}</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Duration</div>
                    <div>{c.getDuration()}&nbsp;Day</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Price</div>
                    <div>{c.getCar(cars).price}&nbsp;€ / Day</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Total Price</div>
                    <div>{c.getTotalPrice(cars)}&nbsp;€</div>
                  </div>
                  <div className="flex gap-3 text-lg justify-between">
                    <div className="font-semibold">Status</div>
                    <span className={`badge badge-soft badge-lg w-32 ${c.getStatus() ? "badge-success" : "badge-secondary"}`}>{c.getStatus() ? "Active" : "Expired"}</span>
                  </div>
                  {/* Download PDF Button */}
                  <div className="flex justify-center mt-6">
                    <PDFDownloadLink
                      document={<ContractPDF contract={c} car={c.getCar(cars)} client={user} />}
                      fileName={`contract_${c.id}.pdf`}
                      className="btn btn-primary"
                    >
                      {({ loading }) => (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faDownload} />
                          {loading ? "Generating PDF..." : "Download Contract as PDF"}
                        </div>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
            </div>
            )
            )}
        </div>
    )
}