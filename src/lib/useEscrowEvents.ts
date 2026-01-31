import { useContractEvents } from 'wagmi';
import escrowABI from '../contracts/escrowABI.json';

export function useEscrowEvents(contractAddress: string) {
  const escrowsCreated = useContractEvents({
    address: contractAddress as `0x${string}`,
    abi: escrowABI,
    eventName: 'EscrowCreated',
  }).data ?? [];
  const funded = useContractEvents({
    address: contractAddress as `0x${string}`,
    abi: escrowABI,
    eventName: 'Funded',
  }).data ?? [];
  const proofSubmitted = useContractEvents({
    address: contractAddress as `0x${string}`,
    abi: escrowABI,
    eventName: 'ProofSubmitted',
  }).data ?? [];
  const approved = useContractEvents({
    address: contractAddress as `0x${string}`,
    abi: escrowABI,
    eventName: 'Approved',
  }).data ?? [];
  const released = useContractEvents({
    address: contractAddress as `0x${string}`,
    abi: escrowABI,
    eventName: 'Released',
  }).data ?? [];

  return [
    ...escrowsCreated,
    ...funded,
    ...proofSubmitted,
    ...approved,
    ...released,
  ];
}
