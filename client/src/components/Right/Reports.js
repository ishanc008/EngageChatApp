import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Menu, Dropdown, Modal, Checkbox } from "antd";
import Report from "./Report";

const reportOptions = ["Spam", "Abusive", "Misleading"];

const CheckboxGroup = Checkbox.Group;

const Reports = ({
  isVisible,
  setIsVisible,
  reports,
  setDeleteReportIndex,
  setDeleteMessageId,
}) => {
  //   console.log(reports);
  const handleOk = () => {
    // console.log("reported");
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      title="Reported Messages"
      visible={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable="true"
      //   closable={false}
      width={540}
      bodyStyle={{ overflowX: "scroll" }}
      // footer={null}
      // okButtonProps={(disabled = true)}
      cancelText="Report"
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
      okButtonProps={{
        style: {
          alignItems: "center",
        },
      }}
      bodyStyle={{ borderRadius: "5em" }}
    >
      {/* <ScrollToBottom className="messages"> */}
      {reports.map((report, i) => {
        return (
          <div key={i}>
            <Report
              index={i}
              report={report}
              setDeleteReportIndex={setDeleteReportIndex}
              setDeleteMessageId={setDeleteMessageId}
            />
          </div>
        );
      })}
      {/* </ScrollToBottom> */}
    </Modal>
  );
};

export default Reports;
