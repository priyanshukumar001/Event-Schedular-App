import { useAdminData } from "../../../config/globalVariables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

// For rendering admin related information
const AdminProfile = () => {
    const [adminData] = useAdminData();

    return (
        <Card className="h-full shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Admin Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <UserCircle className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Welcome, {adminData?.name}</h2>
                        <p className="text-muted-foreground">Admin Dashboard</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminProfile;