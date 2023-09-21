package ecoders.ecodersbackend.domain.mission.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodayMissionResponseDto {

    private Long today_mission_id;
    private String text;
    private boolean completed;
    private UUID memberId;

}
