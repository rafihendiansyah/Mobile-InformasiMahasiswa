// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { auth, db } from "../../src/firebaseConfig";
import { getItem, setItem, removeItem } from "../../src/storage";

const USER_STORAGE_KEY = "currentUser";

export default function IndexScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // state form login/register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // state data mahasiswa
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [loadingMahasiswa, setLoadingMahasiswa] = useState(false);

  // 1. Cek user dari storage saat awal
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const savedUser = await getItem(USER_STORAGE_KEY);
        console.info("Initial savedUser from storage:", savedUser);
        if (mounted && savedUser) setUser(savedUser);
      } catch (e) {
        console.warn("Error reading saved user:", e);
      } finally {
        if (mounted) setInitializing(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Listener Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const simpleUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        };
        setUser(simpleUser);
        try {
          await setItem(USER_STORAGE_KEY, simpleUser); // simpan ke storage (AsyncStorage)
        } catch (e) {
          console.warn("Failed to persist user:", e);
        }
      } else {
        setUser(null);
        try {
          await removeItem(USER_STORAGE_KEY);
        } catch (e) {
          console.warn("Failed to remove saved user:", e);
        }
      }
    });

    return unsubscribe;
  }, []);

  // 3. Register
  const handleRegister = async () => {
    setAuthError("");
    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }
    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // 4. Login
  const handleLogin = async () => {
    setAuthError("");
    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // 5. Logout
  const handleLogout = async () => {
    await signOut(auth);
    removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // 6. Fetch data mahasiswa dari Firestore
  useEffect(() => {
    if (!user) return;

    setLoadingMahasiswa(true);

    //  Sesuai Firestore
    const q = query(collection(db, "Mahasiswa"), orderBy("Nama"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setMahasiswa(data);
        setLoadingMahasiswa(false);
      },
      (error) => {
        console.log("Error fetch mahasiswa:", error);
        setLoadingMahasiswa(false);
      }
    );

    return unsubscribe;
  }, [user]);

  if (initializing) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Memuat...</Text>
      </SafeAreaView>
    );
  }

  // === Jika BELUM login ===
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <View style={styles.centeredBox}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome</Text>
            <Text style={styles.headerSubtitle}>
              Sign in or create an account
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 30, gap: 12 }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flex: 1,
                  backgroundColor: "#2A2A3E",
                  borderWidth: 1.5,
                  borderColor: "#FF6B35",
                },
              ]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // === Jika SUDAH login → tampilkan data mahasiswa ===
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/*  Field mengikuti Firestore */}
      <Text style={styles.cardTitle}>{item.Nama}</Text>
      <Text style={styles.cardText}>NIM: {item.NIM}</Text>
      <Text style={styles.cardText}>Jurusan: {item.Jurusan}</Text>
      <Text style={styles.cardText}>Angkatan: {item.Angkatan}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.centeredContainer}>
      <View style={styles.centeredBox}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Students</Text>
            <Text style={styles.infoText}>
              Logged in as: {(user as any).email}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {loadingMahasiswa ? (
          <ActivityIndicator color="#FF6B35" size="large" />
        ) : (
          <FlatList
            data={mahasiswa}
            keyExtractor={(item: any) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <Text style={styles.infoText}>No student records found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    padding: 16,
  },
  centeredBox: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  header: { marginTop: 40, marginBottom: 30 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FF6B35",
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 16, color: "#AAA", fontWeight: "400" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 0,
    color: "#FF6B35",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#2A2A3E",
    color: "#FFF",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FF6B35",
  },
  secondaryButton: { backgroundColor: "#2A2A3E" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  errorText: { color: "#FF6B35", marginBottom: 8 },
  row: { flexDirection: "row", marginTop: 8 },
  card: {
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#2A2A3E",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: 6,
  },
  cardText: { fontSize: 14, color: "#CCC", marginBottom: 2 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FF6B35",
    backgroundColor: "transparent",
  },
  logoutText: { fontSize: 12, color: "#FF6B35", fontWeight: "600" },
  infoText: { fontSize: 13, marginBottom: 8, color: "#AAA" },
});
