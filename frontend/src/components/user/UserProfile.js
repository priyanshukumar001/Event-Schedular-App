import { useUserData } from "../../../config/globalVariables";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const UserProfile = () => {
    const [userData, setUserData] = useUserData();

    return (
        <Card className="shadow-lg bg-white">
            <CardHeader className="bg-blue-brand text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                    <User className="h-8 w-8" />
                    User Profile
                </CardTitle>
                <CardDescription className="text-white/90">
                    Manage your profile information
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                    <div className="text-center">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-brand mb-2">
                            <span className="text-3xl font-semibold">{userData?.name?.charAt(0) || "U"}</span>
                        </div>
                        <h1 className="text-3xl font-bold">Hi! {userData?.name}</h1>
                        <div className="flex justify-center mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-brand">
                                User
                            </Badge>
                        </div>
                    </div>

                    {userData?.email && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="text-gray-900">{userData.email}</p>
                        </div>
                    )}

                    {userData?.user && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                            <p className="text-gray-900 truncate">{userData.user}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfile;