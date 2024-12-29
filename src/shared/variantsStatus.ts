import { statusOrderVariants } from "./StatusOrderVariants";

interface StatusOrder{
    code: string,
    label: string,
    color: string
}
const statusOrder:StatusOrder[] = [
    {
        code: statusOrderVariants.accepted.code,
        label: statusOrderVariants.accepted.label,
        color: statusOrderVariants.accepted.color
    },
    {
        code: statusOrderVariants.ready.code,
        label: statusOrderVariants.ready.label,
        color: statusOrderVariants.ready.color
    },
    {
        code: statusOrderVariants.deliverytouser.code,
        label: statusOrderVariants.deliverytouser.label,
        color: statusOrderVariants.deliverytouser.color
    },
    {
        code: statusOrderVariants.cancelled.code,
        label: statusOrderVariants.cancelled.label,
        color: statusOrderVariants.cancelled.color
    },
    {
        code: statusOrderVariants.created.code,
        label: statusOrderVariants.created.label,
        color: statusOrderVariants.created.color
    },
    {
        code: statusOrderVariants.delivered.code,
        label: statusOrderVariants.delivered.label,
        color: statusOrderVariants.delivered.color
    },
    {
        code: statusOrderVariants.ordered.code,
        label: statusOrderVariants.ordered.label,
        color: statusOrderVariants.ordered.color
    },
    {
        code: statusOrderVariants.prepared.code,
        label: statusOrderVariants.prepared.label,
        color: statusOrderVariants.prepared.color
    },
    {
        code: statusOrderVariants.sent.code,
        label: statusOrderVariants.sent.label,
        color: statusOrderVariants.sent.color
    },
    {
        code: statusOrderVariants.waiting.code,
        label: statusOrderVariants.waiting.label,
        color: statusOrderVariants.waiting.color
    }
]

export  {
    statusOrder
}