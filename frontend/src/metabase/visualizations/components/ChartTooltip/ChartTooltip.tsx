import { MouseEvent, useMemo } from "react";
import _ from "underscore";
import { getEventTarget } from "metabase/lib/dom";
import Tooltip from "metabase/core/components/Tooltip";
import DataPointTableTooltip from "./DataPointTableTooltip";
import KeyValuePairChartTooltip from "./KeyValuePairChartTooltip";
import TimelineEventTooltip from "./TimelineEventTooltip";
import {
  HoveredObject,
  HoveredTimelineEvent,
  VisualizationSettings,
} from "./types";

export interface ChartTooltipProps {
  hovered?: HoveredObject;
  settings: VisualizationSettings;
}

const ChartTooltip = ({ hovered, settings }: ChartTooltipProps) => {
  const tooltip = useMemo(() => {
    if (!hovered) {
      return null;
    }
    if (!_.isEmpty(hovered.timelineEvents)) {
      return <TimelineEventTooltip hovered={hovered as HoveredTimelineEvent} />;
    }

    if (hovered.dataPointTableTooltipModel) {
      return <DataPointTableTooltip {...hovered.dataPointTableTooltipModel} />;
    }

    return <KeyValuePairChartTooltip hovered={hovered} settings={settings} />;
  }, [hovered, settings]);

  const isNotEmpty = useMemo(() => {
    if (!hovered) {
      return false;
    }
    return (
      hovered.value !== undefined ||
      !_.isEmpty(hovered.timelineEvents) ||
      !_.isEmpty(hovered.dataPointTableTooltipModel) ||
      !_.isEmpty(hovered.data) ||
      !_.isEmpty(hovered.dimensions)
    );
  }, [hovered]);

  const hasTargetEvent = hovered?.event != null;
  const hasTargetElement =
    hovered?.element != null && document.body.contains(hovered.element);
  const isOpen = isNotEmpty && (hasTargetElement || hasTargetEvent);
  const isPadded = hovered?.dataPointTableTooltipModel == null;

  const target = hasTargetElement
    ? hovered?.element
    : hasTargetEvent
    ? getEventTarget(hovered.event as MouseEvent)
    : null;

  return target ? (
    <Tooltip
      preventOverflow
      reference={target}
      isOpen={isOpen}
      isPadded={isPadded}
      tooltip={tooltip}
      maxWidth="unset"
    />
  ) : null;
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default ChartTooltip;
