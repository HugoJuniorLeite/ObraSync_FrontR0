import React, { useState } from "react";
import AttendanceWizardModal from "../../components/RDO/Wizard/AttendanceWizardModal";

export default function GasistaPage() {
  const [show, setShow] = useState(true);

  return (
    <>
      {/* Se quiser colocar um botão:
      <button onClick={() => setShow(true)}>Abrir Jornada</button>
      */}

      <AttendanceWizardModal
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
}
