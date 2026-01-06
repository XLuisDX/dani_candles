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
  Img,
} from "@react-email/components";
import { OrderConfirmationEmailProps } from "@/types/types";

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderId,
  totalFormatted,
  currencyCode,
  customerName,
  items,
  shippingAddress,
}) => {
  const logoUrl =
    "https://ljopaeulxrbucfejzcll.supabase.co/storage/v1/object/public/logo/logo_white.png";

  return (
    <Html>
      <Head />
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#faf9f7",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Section
            style={{
              background: "linear-gradient(135deg, #d4a574 0%, #c99159 100%)",
              padding: "48px 40px",
              textAlign: "center",
            }}
          >
            <Img
              src={logoUrl}
              alt="Dani Candles"
              width="80"
              height="80"
              style={{
                margin: "0 auto 20px",
                display: "block",
              }}
            />

            <Heading
              as="h1"
              style={{
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                margin: "0 0 12px 0",
              }}
            >
              DANI CANDLES
            </Heading>

            <div
              style={{
                display: "inline-block",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "24px",
                padding: "8px 20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                Order Confirmed
              </Text>
            </div>
          </Section>

          <Section style={{ padding: "40px" }}>
            <Heading
              as="h2"
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#1a1a1a",
                margin: "0 0 16px 0",
                lineHeight: 1.4,
              }}
            >
              Thank you for your order, {customerName || "friend"}
            </Heading>

            <Text
              style={{
                margin: "0 0 24px 0",
                fontSize: "15px",
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              We&apos;ve received your order and are preparing your handcrafted
              candles with care. You&apos;ll receive another email with tracking
              information once your order ships.
            </Text>

            <Section
              style={{
                backgroundColor: "#faf9f7",
                borderRadius: "12px",
                padding: "20px 24px",
                marginBottom: "32px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Text
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Order Number
              </Text>
              <Text
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontFamily: "monospace",
                }}
              >
                {orderId}
              </Text>
            </Section>

            <Section
              style={{
                marginBottom: "32px",
              }}
            >
              <Heading
                as="h3"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  margin: "0 0 20px 0",
                }}
              >
                Order Summary
              </Heading>

              {items.length === 0 ? (
                <Text
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Your order has been received.
                </Text>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={`${item.name}-${index}`}
                        style={{
                          borderBottom:
                            index < items.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "16px 0",
                            verticalAlign: "top",
                          }}
                        >
                          <Text
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "#1a1a1a",
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#9ca3af",
                            }}
                          >
                            Quantity: {item.quantity} ×{" "}
                            {item.unitPriceFormatted} {currencyCode}
                          </Text>
                        </td>
                        <td
                          style={{
                            padding: "16px 0",
                            textAlign: "right",
                            verticalAlign: "top",
                          }}
                        >
                          <Text
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#1a1a1a",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.lineTotalFormatted} {currencyCode}
                          </Text>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          padding: "20px 0 0 0",
                        }}
                      >
                        <Hr
                          style={{
                            borderColor: "#d4a574",
                            borderWidth: "2px",
                            margin: "0 0 20px 0",
                          }}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          padding: "0",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          Total
                        </Text>
                      </td>
                      <td
                        style={{
                          padding: "0",
                          textAlign: "right",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#d4a574",
                          }}
                        >
                          {totalFormatted} {currencyCode}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </Section>

            <Section
              style={{
                backgroundColor: "#faf9f7",
                borderRadius: "12px",
                padding: "20px 24px",
                marginBottom: "32px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Text
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Shipping Address
              </Text>
              <Text
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.7,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: "#1a1a1a",
                    fontWeight: 600,
                  }}
                >
                  {customerName}
                </strong>
                {shippingAddress.line1}
                {shippingAddress.line2 && (
                  <>
                    <br />
                    {shippingAddress.line2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postal_code}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>

            <Section
              style={{
                backgroundColor: "#f0ebe5",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "32px",
                borderLeft: "4px solid #d4a574",
              }}
            >
              <Heading
                as="h3"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: "0 0 12px 0",
                }}
              >
                What happens next?
              </Heading>
              <Text
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.7,
                }}
              >
                Your order is being carefully prepared. We hand-pour each candle
                in small batches to ensure the highest quality. You&apos;ll
                receive a shipping confirmation email with tracking details as
                soon as your order is on its way.
              </Text>
            </Section>
          </Section>

          <Section
            style={{
              padding: "32px 40px",
              backgroundColor: "#faf9f7",
              borderTop: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "13px",
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              Thank you for choosing Dani Candles. We look forward to filling
              your space with warmth and tranquility.
            </Text>

            <Text
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Questions? Reach out to us at{" "}
              <a
                href="mailto:hello@danicandles.com"
                style={{
                  color: "#d4a574",
                  textDecoration: "none",
                }}
              >
                hello@danicandles.com
              </a>
            </Text>

            <Hr
              style={{
                borderColor: "#e5e7eb",
                margin: "24px 0 16px 0",
              }}
            />

            <Text
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              © {new Date().getFullYear()} Dani Candles · Dickson, TN
              <br />
              All rights reserved
            </Text>
          </Section>
        </Container>

        <Section style={{ height: "40px" }} />
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
