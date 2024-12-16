import { useAuth } from '@clerk/clerk-expo';
import ProtectedRoute from './components/ProtectedRoute'
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Switch, StyleSheet, ScrollView, Button, StatusBar } from "react-native";
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Preferences {
  shareEmail: boolean;
  shareContactNumber: boolean;
  shareAddress: boolean;
}

interface User {
  avatar: string | null;
  createdAt: string | null;
  emailId: string | null;
  fullName: string | null;
  role: string | null;
  updatedAt: string | null;
  userId: string | null;
  _id: string | null;
}



export default function Home() {
  const { userId, signOut,getToken } = useAuth();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/auth/sign-in'); 
    }
   
  }, [isLoaded, isSignedIn, router]);
const [token,setToken]=useState("");
useEffect(()=>{
  getToken().then((res)=>{
    setToken(res);
  })
})

useEffect(()=>{

},[token])


  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [isPrefernceModalOpen, setIsPreferenceModalOpen] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<Preferences>({
    shareEmail: false,
    shareContactNumber: false,
    shareAddress: false,
  });
  const [user, setUser] = useState<User>({
    avatar: null,
    createdAt: null,
    emailId: null,
    fullName: null,
    role: null,
    updatedAt: null,
    userId: null,
    _id: null,
  });

  const [userDetails, setUserDetails] = useState({
    email: "",
    address: "",
    contactNumber: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [tempDetails, setTempDetails] = useState({ field: "", value: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);



  const handleOk = async () => {
    if(token){
      const axiosInstance= axios.create({
        baseURL: 'https://sharence-server.onrender.com/api/v1/',
        timeout: 500000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      })
  
    if (!fullName) {
      Toast.show({
        type:"error",
        text1:"Please enter name to continue"
      })
    } else {
      try {

        const res = await axiosInstance.post('auth/update', { fullName });
        if (res.data.statusCode < 400) {
          Toast.show({
          type:"success",
          text1:"User Profile updated successfully."
          })
          setFullName(fullName)
          userDetails[fullName]=fullName
          setIsOpen(false);
          setIsNameModalOpen(false);
        } else {
          Toast.show({
            type:"error",
            text1:res.data.message
            })
        }
      } catch (err) {
        Toast.show({
          type:"error",
          text1:err?.response?.data?.message || 'Error occurred while updating profile.'
        })
      }
    }
  }
  };

  const handlePreferenceSubmit = async () => {
    const axiosInstance= axios.create({
      baseURL: 'https://sharence-server.onrender.com/api/v1/',
      timeout: 500000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    })

    try {
      const res = await axiosInstance.put('preferences/update', {
        shareEmail: preferences.shareEmail,
        shareContactNumber: preferences.shareContactNumber,
        shareAddress: preferences.shareAddress,
      });
      handleSubmit()
      if (res.data.statusCode < 400) {
        console.log(res.data.data);
        setPreferences(res.data.data);
        setIsPreferenceModalOpen(false);

        Toast.show({
          type:"success",
          text1:"Preferences updated successfully."
        })
      } else {
        Toast.show({
          type:"error",
          text1:res.data.message
          })
          console.log(res.data.message)
      }
    } catch (err) {
      Toast.show({
        type:"error",
        text1:err?.response?.data?.message || 'Error occurred while updating preferences.'
        })
        console.log(err+1)
    }
  };

  const handlePreferenceCancel = () => {
    setIsPreferenceModalOpen(false);
  };

  const handlePreferenceOpen = () => {
    setIsPreferenceModalOpen(true);
  };

  useEffect(() => {
  if(token){
    const axiosInstance= axios.create({
      baseURL: 'https://sharence-server.onrender.com/api/v1/',
      timeout: 500000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    })

    axiosInstance.get("auth/get").then((res) => {
      if (res.data.statusCode < 400) {
        setUser(res.data.data);
        setFullName(res.data.data?.fullName)
        if (res.data.data?.fullName === "null null" || !res.data.data?.fullName) {
          setIsNameModalOpen(true);
        } else {
          setIsNameModalOpen(false);
        }
      } else {
        Toast.show({
          type:"error",
          text1:res.data.message
          })
      }
    }).catch((err) => {
      Toast.show({
        type:"error",
        text1:err?.response?.data?.message || 'Error occurred getting user profile'
        })    });}
  }, [token]);

  useEffect(() => {
    if(token){
      const axiosInstance= axios.create({
        baseURL: 'https://sharence-server.onrender.com/api/v1/',
        timeout: 500000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      })
  
    axiosInstance.get('preferences/get').then((res) => {
      if (res.data.statusCode < 400) {
        setPreferences(res.data.data);
      } else {
        Toast.show({
          type:"error",
          text1:res.data.message
          })
      }
    }).catch((err) => {
      Toast.show({
        type:"error",
        text1:err?.response?.data?.message || 'Error occurred while getting preferences.'
        })    });}
  }, [token]);



  useEffect(() => {
    if(token){
      const axiosInstance= axios.create({
        baseURL: 'https://sharence-server.onrender.com/api/v1/',
        timeout: 500000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      })
  
    axiosInstance.get('details/get').then((res) => {
      if (res.data.statusCode < 400) {
        setUserDetails({
          email:res.data.data.email,
          address:res.data.data.address,
          contactNumber:res.data.data.contactNumber
      })
      } else {
        Toast.show({
          type:"error",
          text1:res.data.message
          })
      }
    }).catch((err) => {
      Toast.show({
        type:"error",
        text1:err?.response?.data?.message || 'Error occurred while getting User Details.'
        })    });}
  }, [token]);


  const showEditModal = (field) => {
    setEditingField(field);
    setTempDetails({ field, value: userDetails[field] || "" });
    setIsModalVisible(true);
  };

  const handleModalSave = () => {
    setUserDetails((prev) => ({
      ...prev,
      [tempDetails.field]: tempDetails.value,
    }));
    setIsModalVisible(false);
  };

  const handleTempDetailsChange = (value) => {
    setTempDetails((prev) => ({ ...prev, value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const axiosInstance= axios.create({
        baseURL: 'https://sharence-server.onrender.com/api/v1/',
        timeout: 500000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      })
  
      const preferenceResponse = await axiosInstance.put("preferences/update", {
        shareEmail: preferences.shareEmail,
        shareContactNumber: preferences.shareContactNumber,
        shareAddress: preferences.shareAddress,
      });

      if (preferenceResponse.data.statusCode < 400) {
        setPreferences(preferenceResponse.data.data);

        const detailsResponse = await axiosInstance.put("details/update", userDetails);

        if (detailsResponse.data.statusCode < 400) {
          setUserDetails({
            email: detailsResponse.data.data.email,
            address: detailsResponse.data.data.address,
            contactNumber: detailsResponse.data.data.contactNumber,
          });

          Toast.show({
            type: "success",
            text1: "User details updated successfully.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: detailsResponse.data.message,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: preferenceResponse.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Error occurred while updating details.",
      });
    }
  };

  useEffect(() => {
    if (preferences.shareEmail && !userDetails.email) showEditModal("email");
    if (preferences.shareAddress && !userDetails.address) showEditModal("address");
    if (preferences.shareContactNumber && !userDetails.contactNumber)
      showEditModal("contactNumber");
  }, [userDetails, preferences]);    


  
  return (
    <>
    <ProtectedRoute>
      <SafeAreaView style={{...styles.safeArea,  height:"100%",backgroundColor:"red"}}>
      <StatusBar hidden={false} barStyle="dark-content" backgroundColor="#ffffff" />
    <View style={{...styles.container}}>
      {/* Sidebar */}
      <View style={{...styles.sidebar , height:"100%"}}>
  
        <View style={styles.userInfo}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={{ ...styles.avatar, width: 60, height: 60 }} />
          ) : (
            <Text style={styles.avatar}>DP</Text>
          )}
          <Text style={styles.userName}>{user.fullName}</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setIsNameModalOpen(true)} style={styles.menuItem}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePreferenceOpen} style={styles.menuItem}>
            <Text style={styles.menuText}>Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.menuItem}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.userDetailContainer,marginTop:30}}>
            <Text style={styles.heading}>User Details</Text>

            {/* Email Row */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>
                {userDetails.email || "Not Provided"}
              </Text>
              <TouchableOpacity
                onPress={() => showEditModal("email")}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Address Row */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>
                {userDetails.address || "Not Provided"}
              </Text>
              <TouchableOpacity
                onPress={() => showEditModal("address")}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Number Row */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Contact Number:</Text>
              <Text style={styles.value}>
                {userDetails.contactNumber || "Not Provided"}
              </Text>
              <TouchableOpacity
                onPress={() => showEditModal("contactNumber")}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleSubmit}  style={{
    backgroundColor: "#007BFF", // Button background color
    padding: 12,               // Padding inside the button
    borderRadius: 8,           // Rounded corners
    justifyContent: "center",  // Align text vertically
    alignItems: "center",      // Align text horizontally
    width: "80%",              // Optional: Button width
    alignSelf: "center",       // Optional: Center button horizontally
  }}>
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>Save Details</Text>
            </TouchableOpacity>
          </View>
        
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Name Modal */}
        <Modal visible={isNameModalOpen} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Please enter your Name to continue.</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
              <TouchableOpacity onPress={handleOk} style={styles.button}>
                <Text style={styles.buttonText}>Save Name</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsNameModalOpen(false)} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Preferences Modal */}
        <Modal visible={isPrefernceModalOpen} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Preferences</Text>
              <ScrollView>
                {/* Share Email */}
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Share Email</Text>
                  <Switch
                    value={preferences.shareEmail}
                    onValueChange={() =>
                      setPreferences({ ...preferences, shareEmail: !preferences.shareEmail })
                    }
                  />
                </View>
                {/* Share Contact */}
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Share Contact Number</Text>
                  <Switch
                    value={preferences.shareContactNumber}
                    onValueChange={() =>
                      setPreferences({
                        ...preferences,
                        shareContactNumber: !preferences.shareContactNumber,
                      })
                    }
                  />
                </View>
                {/* Share Address */}
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Share Address</Text>
                  <Switch
                    value={preferences.shareAddress}
                    onValueChange={() =>
                      setPreferences({ ...preferences, shareAddress: !preferences.shareAddress })
                    }
                  />
                </View>
                <TouchableOpacity onPress={handlePreferenceSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Save Preferences</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePreferenceCancel} style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
       
      {/* Edit Modal */}
      <Modal style={{backgroundColor:"white"}} visible={isModalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Edit {editingField}</Text>
          <TextInput
            style={styles.input}
            value={tempDetails.value}
            onChangeText={handleTempDetailsChange}
            placeholder={`Enter your ${editingField}`}
          />
          {editingField === "email" && (
            <View style={styles.checkboxContainer}>
              <Switch
                value={preferences.shareEmail}
                onValueChange={(value) => handlePreferenceChange("shareEmail", value)}
              />
              <Text style={styles.checkboxLabel}>Share Email</Text>
            </View>
          )}
          {editingField === "address" && (
            <View style={styles.checkboxContainer}>
              <Switch
                value={preferences.shareAddress}
                onValueChange={(value) => handlePreferenceChange("shareAddress", value)}
              />
              <Text style={styles.checkboxLabel}>Share Address</Text>
            </View>
          )}
          {editingField === "contactNumber" && (
            <View style={styles.checkboxContainer}>
              <Switch
                value={preferences.shareContactNumber}
                onValueChange={(value) => handlePreferenceChange("shareContactNumber", value)}
              />
              <Text style={styles.checkboxLabel}>Share Contact Number</Text>
            </View>
          )}
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

       
      </View>
    </View>
    
    </SafeAreaView>
  </ProtectedRoute>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
    backgroundColor: "#F5F5F5", // Background color for the safe area
  },
 
  container: {
    flex: 1,
    
    backgroundColor: "#F5F5F5", // Light gray background
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF", // White background
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Dark text color
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC", // Light gray border
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF", // Blue background
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "600",
  },
  preferenceRow: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space between label and switch
    alignItems: "center", // Align items vertically in the center
    paddingVertical: 10, // Add vertical padding for spacing
    paddingHorizontal: 20, // Add horizontal padding
    borderBottomWidth: 1, // Add a bottom border for separation
    borderBottomColor: "#CCC", // Light gray border color
  },
  preferenceLabel: {
    fontSize: 16, // Adjust the text size
    fontWeight: "500", // Slightly bold text
    color: "#333", // Dark gray for better readability
  },
  sidebar: {
    width: "100%",
    backgroundColor: "#FFF", // White background
    padding: 20,

    borderTopWidth: 1,
    borderTopColor: "#CCC", // Light gray top border
  },
  userInfo: {
    alignItems: "center", // Center align user info content
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#007BFF", // Blue background for avatar
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#FFF", // White text
    fontSize: 18,
    fontWeight: "bold",
    overflow: "hidden", // Prevent content overflow
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Dark gray text
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: "#CCC", // Light gray border
    paddingTop: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC", // Light gray border
  },
  menuText: {
    fontSize: 16,
    color: "#333", // Dark gray text
  },
  hamburgerButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#007BFF", // Blue background
    padding: 10,
    borderRadius: 5,
  },
  hamburgerIcon: {
    fontSize: 16,
    color: "#FFF", // White text
    fontWeight: "bold",
  },
  sidebarText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  userDetailContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#555",
    flex: 2,
    textAlign: "right",
  },
  editButton: {
    backgroundColor: "#FF6500",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "black",
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
});
