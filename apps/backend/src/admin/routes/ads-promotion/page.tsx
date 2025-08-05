import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  toast,
} from "@medusajs/ui";
import { useState } from "react";
import { useAdsPromotions, useReviewAdsPromotion } from "../../hooks/api/ads-promotion";
import { AdsPromotionDetail } from "./components/ads-promotion-detail";
import { CreateAdsPricingForm } from "./components/create-pricing-form";
import { formatDate } from "../../lib/date";

const AdsPromotionPage = () => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showPricingForm, setShowPricingForm] = useState(false);
  
  const { ads_promotions } = useAdsPromotions();
  const { mutateAsync: reviewAd } = useReviewAdsPromotion({
    onSuccess: () => {
      toast.success("Ad promotion reviewed successfully");
      setSelectedAd(null);
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { color: "orange", text: "Pending Payment" },
      active: { color: "green", text: "Active" },
      paused: { color: "grey", text: "Paused" },
      expired: { color: "red", text: "Expired" },
      rejected: { color: "red", text: "Rejected" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "grey", text: status };
    return <StatusBadge color={config.color as "orange" | "green" | "grey" | "red"}>{config.text}</StatusBadge>;
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Ads Promotion Management</Heading>
        <Button onClick={() => setShowPricingForm(true)}>Manage Pricing</Button>
      </div>

      <div className="px-6 py-4">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Seller</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Budget</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ads_promotions?.map((ad:any) => (
              <Table.Row key={ad.id}>
                <Table.Cell>{ad.title}</Table.Cell>
                    <Table.Cell>{ad.seller_id}</Table.Cell>
                <Table.Cell className="capitalize">{ad.type}</Table.Cell>
                <Table.Cell>₦{ad.budget_amount.toLocaleString()}</Table.Cell>
                <Table.Cell>{getStatusBadge(ad.status)}</Table.Cell>
                <Table.Cell>{formatDate(ad.created_at)}</Table.Cell>
                <Table.Cell>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setSelectedAd(ad)}
                  >
                    Review
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <AdsPromotionDetail
        ad={selectedAd}
        open={!!selectedAd}
        close={() => setSelectedAd(null)}
        onReview={reviewAd}
      />

      <CreateAdsPricingForm
        open={showPricingForm}
        close={() => setShowPricingForm(false)}
      />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Ads Promotion",
});

export default AdsPromotionPage;