import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from "@react-email/components";

export interface OrderShippedItemEmail {
  name: string;
  quantity: number;
  lineTotalFormatted: string;
}

export interface ShippingAddressEmail {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderShippedEmailProps {
  orderId: string;
  trackingNote?: string;
  totalFormatted: string;
  currencyCode: string;
  customerName: string;
  items: OrderShippedItemEmail[];
  shippingAddress: ShippingAddressEmail;
}

export const OrderShippedEmail: React.FC<OrderShippedEmailProps> = ({
  orderId,
  trackingNote,
  totalFormatted,
  currencyCode,
  customerName,
  items,
  shippingAddress,
}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#020617",
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          color: "#f9fafb",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            padding: "28px 20px 32px",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Heading
              as="h1"
              style={{
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#e5e7eb",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              DANI CANDLES
            </Heading>
            <Text
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Your order is on its way ✨
            </Text>
          </Section>

          {/* Intro */}
          <Section
            style={{
              backgroundColor: "#0b1120",
              borderRadius: "18px",
              padding: "20px 20px 16px",
              border: "1px solid #1f2937",
              marginBottom: "16px",
            }}
          >
            <Heading
              as="h2"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: 0,
                marginBottom: "6px",
              }}
            >
              Hi {customerName || "friend"}, your candles are on the way 🌙
            </Heading>
            <Text
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#9ca3af",
                lineHeight: 1.6,
              }}
            >
              Your Dani Candles order has just shipped. Get ready to light up
              your space with a little extra magic.
            </Text>

            <Text
              style={{
                marginTop: "10px",
                marginBottom: 0,
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              <strong style={{ color: "#e5e7eb" }}>Order ID:</strong>{" "}
              <span style={{ fontFamily: "monospace" }}>{orderId}</span>
            </Text>

            {trackingNote && (
              <Text
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  fontSize: "12px",
                  color: "#e5e7eb",
                }}
              >
                {trackingNote}
              </Text>
            )}
          </Section>

          {/* Items */}
          <Section
            style={{
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: "1px solid #1f2937",
              padding: "18px 18px 14px",
              marginBottom: "16px",
            }}
          >
            <Heading
              as="h3"
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#9ca3af",
                margin: 0,
                marginBottom: "10px",
              }}
            >
              What&apos;s on the way
            </Heading>

            {items.length === 0 ? (
              <Text
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#9ca3af",
                }}
              >
                Your order is on the way.
              </Text>
            ) : (
              <>
                {items.map((item, index) => (
                  <Section
                    key={`${item.name}-${index}`}
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Text
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#e5e7eb",
                          fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          margin: 0,
                          marginTop: "2px",
                          fontSize: "11px",
                          color: "#9ca3af",
                        }}
                      >
                        Qty {item.quantity}
                      </Text>
                    </div>
                    <Text
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#e5e7eb",
                      }}
                    >
                      {item.lineTotalFormatted}{" "}
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                        }}
                      >
                        {currencyCode}
                      </span>
                    </Text>
                  </Section>
                ))}

                <Hr
                  style={{
                    borderColor: "#1f2937",
                    margin: "10px 0 6px",
                  }}
                />

                <Section
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#e5e7eb",
                      fontWeight: 600,
                    }}
                  >
                    Order total
                  </Text>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#e5e7eb",
                      fontWeight: 600,
                    }}
                  >
                    {totalFormatted}{" "}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        fontWeight: 400,
                      }}
                    >
                      {currencyCode}
                    </span>
                  </Text>
                </Section>
              </>
            )}
          </Section>

          <Section
            style={{
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: "1px solid #1f2937",
              padding: "16px 18px 14px",
              marginBottom: "18px",
            }}
          >
            <Heading
              as="h3"
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#9ca3af",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Shipping to
            </Heading>
            <Text
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#e5e7eb",
                lineHeight: 1.6,
              }}
            >
              {customerName}
              <br />
              {shippingAddress.line1}
              {shippingAddress.line2
                ? `, ${shippingAddress.line2}`
                : ""}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: "10px" }}>
            <Text
              style={{
                fontSize: "11px",
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              You&apos;re receiving this email because your Dani Candles
              order has shipped. If you didn&apos;t make this purchase,
              please contact us immediately.
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: "#4b5563",
                marginTop: "10px",
              }}
            >
              © {new Date().getFullYear()} Dani Candles. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderShippedEmail;
