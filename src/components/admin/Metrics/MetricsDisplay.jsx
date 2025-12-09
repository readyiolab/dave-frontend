import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MetricsDisplay({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border-black">
        <CardHeader>
          <CardTitle className="text-black">Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black text-2xl">{metrics.total_leads || 0}</p>
        </CardContent>
      </Card>
      <Card className="border-black">
        <CardHeader>
          <CardTitle className="text-black">Active Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black text-2xl">{metrics.active_blogs || 0}</p>
        </CardContent>
      </Card>
      <Card className="border-black">
        <CardHeader>
          <CardTitle className="text-black">Total Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black text-2xl">{metrics.total_comments || 0}</p>
        </CardContent>
      </Card>
      <Card className="border-black">
        <CardHeader>
          <CardTitle className="text-black">Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black text-2xl">{metrics.newsletter_subscribers || 0}</p>
        </CardContent>
      </Card>
      <Card className="border-black">
        <CardHeader>
          <CardTitle className="text-black">Scheduled Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-black text-2xl">{metrics.scheduled_appointments || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}

MetricsDisplay.propTypes = {
  metrics: PropTypes.shape({
    total_leads: PropTypes.number,
    active_blogs: PropTypes.number,
    total_comments: PropTypes.number,
    newsletter_subscribers: PropTypes.number,
    scheduled_appointments: PropTypes.number,
  }).isRequired,
};