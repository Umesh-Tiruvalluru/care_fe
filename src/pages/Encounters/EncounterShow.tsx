import { useQuery } from "@tanstack/react-query";
import { Link, navigate } from "raviger";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "@/components/Common/Loading";
import PageTitle from "@/components/Common/PageTitle";
import ErrorPage from "@/components/ErrorPages/DefaultErrorPage";
// import { ConsultationProvider } from "@/components/Facility/ConsultationContext";
import { ConsultationFeedTab } from "@/components/Facility/ConsultationDetails/ConsultationFeedTab";
import { ConsultationFilesTab } from "@/components/Facility/ConsultationDetails/ConsultationFilesTab";
import { ConsultationMedicinesTab } from "@/components/Facility/ConsultationDetails/ConsultationMedicinesTab";
import { ConsultationNeurologicalMonitoringTab } from "@/components/Facility/ConsultationDetails/ConsultationNeurologicalMonitoringTab";
import ConsultationNursingTab from "@/components/Facility/ConsultationDetails/ConsultationNursingTab";
import { ConsultationPlotsTab } from "@/components/Facility/ConsultationDetails/ConsultationPlotsTab";
import { ConsultationPressureSoreTab } from "@/components/Facility/ConsultationDetails/ConsultationPressureSoreTab";
import { ConsultationUpdatesTab } from "@/components/Facility/ConsultationDetails/ConsultationUpdatesTab";
import { ConsultationModel } from "@/components/Facility/models";
import PatientInfoCard from "@/components/Patient/PatientInfoCard";

import useAuthUser from "@/hooks/useAuthUser";
import { useCareAppConsultationTabs } from "@/hooks/useCareApps";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { Encounter } from "@/types/emr/encounter";
import { PatientModel } from "@/types/emr/patient";

export interface ConsultationTabProps {
  consultationId: string;
  facilityId: string;
  patientId: string;
  consultationData: ConsultationModel;
  patientData: PatientModel;
}

const defaultTabs = {
  UPDATES: ConsultationUpdatesTab,
  FEED: ConsultationFeedTab,
  PLOTS: ConsultationPlotsTab,
  MEDICINES: ConsultationMedicinesTab,
  FILES: ConsultationFilesTab,
  NURSING: ConsultationNursingTab,
  NEUROLOGICAL_MONITORING: ConsultationNeurologicalMonitoringTab,
  PRESSURE_SORE: ConsultationPressureSoreTab,
} as Record<string, React.FC<ConsultationTabProps>>;

export const EncounterShow = ({
  encounterId,
  facilityId,
  tab,
}: {
  encounterId: string;
  facilityId: string;
  tab?: string;
}) => {
  const pluginTabs = useCareAppConsultationTabs();

  const tabs: Record<string, React.FC<ConsultationTabProps>> = {
    ...defaultTabs,
    ...pluginTabs,
  };

  // if (Object.keys(tabs).includes(tab.toUpperCase())) {
  //   tab = tab.toUpperCase();
  // }
  const [showDoctors, setShowDoctors] = useState(false);
  // const [patientData, setPatientData] = useState<PatientModel>();
  // const [activeShiftingData, setActiveShiftingData] = useState<Array<any>>([]);

  // const getPatientGender = (patientData: any) =>
  //   GENDER_TYPES.find((i) => i.id === patientData.gender)?.text;

  // const getPatientAddress = (patientData: any) =>
  //   `${patientData.address},\n${patientData.ward_object?.name},\n${patientData.local_body_object?.name},\n${patientData.district_object?.name},\n${patientData.state_object?.name}`;

  // const getPatientComorbidities = (patientData: any) => {
  //   if (patientData?.medical_history?.length) {
  //     return humanizeStrings(
  //       patientData.medical_history.map((item: any) => item.disease),
  //     );
  //   } else {
  //     return "None";
  //   }
  // };
  const [showPatientNotesPopup, setShowPatientNotesPopup] = useState(false);

  const authUser = useAuthUser();

  const { data: encounterData, isLoading } = useQuery<Encounter>({
    queryKey: ["encounter", encounterId],
    queryFn: query(routes.encounter.get, {
      pathParams: { id: encounterId },
    }),
    enabled: !!encounterId,
  });

  // const encounterQuery = useTanStackQueryInstead(routes.encounter.get, {
  //   pathParams: { id: consultationId },
  // });

  // const consultationData = encounterQuery.data;
  // const bedId = consultationData?.current_bed?.bed_object?.id;

  // const isCameraAttached = useTanStackQueryInstead(routes.listAssetBeds, {
  //   prefetch: !!bedId,
  //   query: { bed: bedId },
  // }).data?.results.some((a) => a.asset_object.asset_class === "ONVIF");

  // const patientDataQuery = useTanStackQueryInstead(routes.getPatient, {
  //   pathParams: { id: consultationQuery.data?.patient ?? "" },
  //   prefetch: !!consultationQuery.data?.patient,
  //   onResponse: ({ data }) => {
  //     if (!data) {
  //       return;
  //     }
  //     setPatientData({
  //       ...data,
  //       gender: getPatientGender(data),
  //       address: getPatientAddress(data),
  //       comorbidities: getPatientComorbidities(data),
  //       is_declared_positive: data.is_declared_positive ? "Yes" : "No",
  //       is_vaccinated: patientData?.is_vaccinated ? "Yes" : "No",
  //     } as any);
  //   },
  // });

  // const fetchData = useCallback(
  //   async (id: string) => {
  //     // Get shifting data
  //     const shiftRequestsQuery = await request(routes.listShiftRequests, {
  //       query: { patient: id },
  //     });
  //     if (shiftRequestsQuery.data?.results) {
  //       setActiveShiftingData(shiftRequestsQuery.data.results);
  //     }
  //   },
  //   [consultationId, patientData?.is_vaccinated],
  // );

  // useEffect(() => {
  //   const id = patientDataQuery.data?.id;
  //   if (!id) {
  //     return;
  //   }
  //   fetchData(id);
  //   triggerGoal("Patient Consultation Viewed", {
  //     facilityId: facilityId,
  //     consultationId: consultationId,
  //     userId: authUser.id,
  //   });
  // }, [patientDataQuery.data?.id]);

  if (isLoading) {
    return <Loading />;
  }

  // const consultationTabProps: ConsultationTabProps = {
  //   consultationId,
  //   consultationData,
  //   patientId: consultationData.patient,
  //   facilityId: consultationData.facility,
  //   patientData,
  // };

  if (!tab) {
    return <ErrorPage />;
  }

  if (!encounterData) {
    return <ErrorPage />;
  }

  const SelectedTab = tabs[tab];

  const tabButtonClasses = (selected: boolean) =>
    `capitalize min-w-max-content cursor-pointer font-bold whitespace-nowrap ${
      selected === true
        ? "border-primary-500 hover:border-secondary-300 text-primary-600 border-b-2"
        : "text-secondary-700 hover:text-secondary-700"
    }`;

  return (
    <div>
      <nav className="relative flex flex-wrap items-start justify-between">
        <PageTitle
          title="Encounter"
          className="sm:m-0 sm:p-0"
          crumbsReplacements={{
            [encounterId]: { name: encounterData.patient.name },
            consultation: {
              name: "Consultation",
              uri: `/facility/${facilityId}/patient/${encounterData.patient.id}/consultation/${encounterId}/update`,
            },
            [encounterId]: {
              name: encounterData.status,
            },
          }}
          breadcrumbs={true}
          backUrl="/patients"
        />
        <div
          className="flex w-full flex-col min-[1150px]:w-min min-[1150px]:flex-row min-[1150px]:items-center"
          id="consultationpage-header"
        >
          {/* {!consultationData.discharge_date && (
            <>
              <button
                id="doctor-connect-button"
                onClick={() => {
                  triggerGoal("Doctor Connect Clicked", {
                    consultationId,
                    facilityId: patientData.facility,
                    userId: authUser.id,
                    page: "ConsultationDetails",
                  });
                  setShowDoctors(true);
                }}
                className="btn btn-primary m-1 w-full hover:text-white"
              >
                Doctor Connect
              </button>
              {patientData.last_consultation?.id &&
                isCameraAttached &&
                CameraFeedPermittedUserTypes.includes(authUser.user_type) && (
                  <Link
                    href={`/facility/${patientData.facility}/patient/${patientData.id}/consultation/${patientData.last_consultation?.id}/feed`}
                    className="btn btn-primary m-1 w-full hover:text-white"
                  >
                    Camera Feed
                  </Link>
                )}
            </>
          )} */}
          <Link
            href={`/facility/${facilityId}/patient/${encounterData.patient.id}`}
            className="btn btn-primary m-1 w-full hover:text-white"
            id="patient-details"
          >
            Patient Details
          </Link>
          <a
            id="patient_discussion_notes"
            onClick={() =>
              showPatientNotesPopup
                ? navigate(
                    `/facility/${facilityId}/patient/${encounterData.patient.id}/notes`,
                  )
                : setShowPatientNotesPopup(true)
            }
            className="btn btn-primary m-1 w-full hover:text-white"
          >
            Discussion Notes
          </a>
        </div>
      </nav>
      <div className="mt-4 w-full border-b-2 border-secondary-200">
        <div className="mt-2 flex w-full flex-col md:flex-row">
          <div className="size-full rounded-lg border bg-white text-black shadow">
            <PatientInfoCard
              patient={encounterData.patient}
              encounter={encounterData}
              fetchPatientData={() => {
                // consultationQuery.refetch();
                // patientDataQuery.refetch();
              }}
            />

            {/* <div className="flex flex-col justify-between px-4 md:flex-row">
              {consultationData.admitted_to && (
                <div className="mt-2 rounded-lg border bg-secondary-100 p-2 md:mt-0">
                  <div className="border-b-2 py-1">
                    Patient
                    {consultationData.discharge_date
                      ? " Discharged from"
                      : " Admitted to"}
                    <span className="badge badge-pill badge-warning ml-2 font-bold">
                      {consultationData.admitted_to}
                    </span>
                  </div>
                  {(consultationData.discharge_date ??
                    consultationData.encounter_date) && (
                    <div className="text-3xl font-bold">
                      {relativeTime(
                        consultationData.discharge_date
                          ? consultationData.discharge_date
                          : consultationData.encounter_date,
                      )}
                    </div>
                  )}
                  <div className="-mt-2 text-xs">
                    {consultationData.encounter_date &&
                      formatDateTime(consultationData.encounter_date)}
                    {consultationData.discharge_date &&
                      ` - ${formatDateTime(consultationData.discharge_date)}`}
                  </div>
                </div>
              )}
            </div> */}
            <div className="flex flex-col justify-between gap-2 px-4 py-1 md:flex-row">
              <div className="font-base flex flex-col text-xs leading-relaxed text-secondary-700">
                <div className="flex items-center">
                  <span className="text-secondary-900">Created: </span>&nbsp;
                  {/* <RelativeDateUserMention
                    actionDate={encounterData.created_date}
                    user={encounterData.created_by}
                    tooltipPosition="right"
                    withoutSuffix={true}
                  /> */}
                </div>
              </div>
              <div className="font-base flex flex-col text-xs leading-relaxed text-secondary-700 md:text-right">
                <div className="flex items-center">
                  <span className="text-secondary-900">Last Modified: </span>
                  &nbsp;
                  {/* <RelativeDateUserMention
                    actionDate={consultationData.modified_date}
                    user={consultationData.last_edited_by}
                    tooltipPosition="left"
                    withoutSuffix={true}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full border-b-2 border-secondary-200">
          <div className="overflow-x-auto sm:flex sm:items-baseline">
            <div className="mt-4 sm:mt-0">
              {/* <nav
                  className="flex space-x-6 overflow-x-auto pb-2 pl-2"
                  id="consultation_tab_nav"
                >
                  {keysOf(tabs).map((p) => {
                    if (p === "FEED") {
                      if (
                        isCameraAttached === false || // No camera attached
                        consultationData?.discharge_date || // Discharged
                        !consultationData?.current_bed?.bed_object?.id || // Not admitted to bed
                        !CameraFeedPermittedUserTypes.includes(
                          authUser.user_type,
                        )
                      )
                        return null; // Hide feed tab
                    }

                    return (
                      <Link
                        key={p}
                        className={tabButtonClasses(tab === p)}
                        href={`/facility/${facilityId}/patient/${patientId}/consultation/${consultationId}/${p.toLocaleLowerCase()}`}
                      >
                        {t(`CONSULTATION_TAB__${p}`)}
                      </Link>
                    );
                  })}
                </nav> */}
            </div>
          </div>
        </div>
        {/* <SelectedTab {...consultationTabProps} /> */}
      </div>
    </div>

    // <DoctorVideoSlideover
    //   facilityId={facilityId}
    //   show={showDoctors}
    //   setShow={setShowDoctors}
    // />

    // {showPatientNotesPopup && (
    //   <PatientNotesSlideover
    //     patientId={patientId}
    //     facilityId={facilityId}
    //     consultationId={consultationId}
    //     setShowPatientNotesPopup={setShowPatientNotesPopup}
    //   />
    // )}
  );
};
