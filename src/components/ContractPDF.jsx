import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import QRCode from "qrcode";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f8f9fa",
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "uppercase",
    color: "#2c3e50",
  },
  section: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  value: {
    fontSize: 13,
    color: "#34495e",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
    color: "#777",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  qrImage: {
    width: 100,
    height: 100,
  },
});

// PDF Document Component
const ContractPDF = ({ contract, car, client }) => {
  const [qrCode, setQrCode] = useState("");

  // Generate QR code from contract details
  useEffect(() => {

    // Convert HTML to a data URL
    const htmlDataUrl = `https://www.medcars.com/clients/${client.id}/contracts/${contract.id}`;

    QRCode.toDataURL(htmlDataUrl)
      .then(setQrCode)
      .catch(err => console.error("QR Code Error:", err));


  }, [contract, car, client]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Rental Contract</Text>
        <Text style={{ textAlign: "right", fontSize: 11, marginBottom: 12 }}>Date: {new Date().toISOString().split("T")[0]}</Text>
        
        {/* Contract Details */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Contract ID:</Text><Text style={styles.value}>{contract.id}</Text></View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { fontWeight: "bold", color: contract.getStatus() ? "green" : "red" }]}>
              {contract.getStatus() ? "Active" : "Expired"}
            </Text>
          </View>
        </View>

        {/* Car Details */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Car:</Text><Text style={styles.value}>{car.getName()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Price per Day:</Text><Text style={styles.value}>{car.price} €</Text></View>
          <View style={styles.row}><Text style={styles.label}>Availability Date:</Text><Text style={styles.value}>{car.getAvailabilityDate([contract]).toISOString().split("T")[0]}</Text></View>
        </View>

        {/* Client Details */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Client:</Text><Text style={styles.value}>{client.getFullName()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Age:</Text><Text style={styles.value}>{client.getAge()} years</Text></View>
        </View>

        {/* Rental Details */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Start Date:</Text><Text style={styles.value}>{contract.startDate}</Text></View>
          <View style={styles.row}><Text style={styles.label}>End Date:</Text><Text style={styles.value}>{contract.endDate}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Duration:</Text><Text style={styles.value}>{contract.getDuration()} Days</Text></View>
          <View style={styles.row}><Text style={styles.label}>Total Price:</Text><Text style={[styles.value, { fontWeight: "bold" }]}>{contract.getTotalPrice([car])} €</Text></View>
        </View>

        {/* QR Code Section */}
        {qrCode && (
          <View style={styles.qrContainer}>
            <Text style={{ textAlign: "center", fontSize: 12, marginBottom: 5 }}>Scan to verify</Text>
            <Image style={styles.qrImage} src={qrCode} />
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>This document is electronically generated and does not require a signature.</Text>
      </Page>
    </Document>
  );
};

export default ContractPDF;
