'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function OwnerCustomForm({oCCTypes}:{oCCTypes:{
    text: string,
    int: string,
    boolean: string,
}})
{
    return(
        <div className="flex w-1/3">
            <div className="w-1/2 mr-3">
                <Label htmlFor="title">データ名</Label>
                <Input type="text" id="title" name="configurationTitle" />
            </div>
            <div className="w-1/2 mr-3">
                <Label>データの形式</Label>
                <Select name="configurationConstraint">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            Object.keys(oCCTypes).map((oCC)=>(
                                <SelectItem value={oCC}>{oCCTypes[oCC]}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}