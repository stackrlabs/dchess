import { zeroAddress } from "viem";

export const ZeroAddress = zeroAddress;

export enum BlockStatus {
  Proposed = "proposed",
  Sequenced = "sequenced",
  Submitting = "submitting",
  Received = "received",
  Rejected = "rejected",
  Verified = "verified",
  Invalid = "invalid",
  DAFinalized = "da_finalized",
  L1Posted = "l1_posted",
  L1Finalized = "l1_finalized",
}

export enum DA {
  AVAIL = "avail",
  CELESTIA = "celestia",
}

export const DA_NAME = {
  [DA.AVAIL]: "Avail",
  [DA.CELESTIA]: "Celestia",
};

export const DA_POINTER_URL = {
  [DA.AVAIL]: "https://avail-turing.subscan.io/extrinsic",
  [DA.CELESTIA]: "https://mocha-4.celenium.io/tx",
};
