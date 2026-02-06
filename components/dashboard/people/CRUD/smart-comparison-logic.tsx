import { useMemo } from "react";
import { ComparisonPayModal } from "./comparison-pay-modal";

export function SmartComparisonLogic({ isOpen, role, allEmployees, onHide, isEdit }: any) {
  const peerMatches = useMemo(() => {
    if (isEdit || !role || role.length < 3) return [];
    return allEmployees.filter((emp: any) => 
      emp.role?.toLowerCase() === role.toLowerCase()
    );
  }, [role, allEmployees, isEdit]);

  if (isEdit || peerMatches.length === 0) return null;

  return (
    <ComparisonPayModal 
      isOpen={isOpen} 
      onClose={onHide}
      roleName={role}
      peers={peerMatches}
    />
  );
}