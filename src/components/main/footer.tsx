import { TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"

const totalListingsSold = 123;
const totalVolume = "45678.90";
const totalMarketplaceFees = "1234.56";
const feePercentage = 2.5;
const avgOrderValue = 370.12;

const Footer = () => {
    return (
        <Alert className="bg-slate-900 border-slate-700">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-slate-300">
                <strong className="text-white">Market Summary:</strong> Your marketplace has processed {totalListingsSold} transactions
                with a total volume of ${parseFloat(totalVolume).toLocaleString()}, generating
                ${parseFloat(totalMarketplaceFees).toFixed(2)} in fees ({feePercentage.toFixed(1)}% fee rate).
                The average order value is ${avgOrderValue.toFixed(2)}.
            </AlertDescription>
        </Alert>
    );
}

export default Footer